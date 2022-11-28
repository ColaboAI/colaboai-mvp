from collections import defaultdict
import pickle
import boto3
from pathlib import Path
import os
import json
from json.decoder import JSONDecodeError
import psycopg2

bucket_name = "colaboaireco"
key_to_pickle = "outputs.pickle"

BASE_DIR = Path(__file__).resolve().parent
secret_file = os.path.join(BASE_DIR, "secrets.json")
try:
    with open(secret_file, encoding="utf8") as f:
        secrets = json.loads(f.read())
except (FileNotFoundError, JSONDecodeError):
    secrets = {}


def get_secret(setting, fallback="asdsad"):
    try:
        return secrets[setting]

    except KeyError:
        return fallback


def get_max_view_combi():
    mydb = psycopg2.connect(
        host=get_secret("DB_HOST"),
        user=get_secret("DB_USER"),
        password=get_secret("DB_PASSWORD"),
        dbname=get_secret("DB_NAME"),
        port=get_secret("DB_PORT"),
    )
    cur = mydb.cursor()

    query = """
    SELECT
        covers.audio,
        covers.song_id,
        filterd_comb.comb_id
    FROM
        "Cover" covers
        INNER JOIN "Cover_Combination" cc ON covers.id = cc.cover_id
        INNER JOIN (
            SELECT
                comb.song_id,
                comb.id AS comb_id
            FROM (
                SELECT
                    comb.id AS id,
                    max(comb.view) AS views
                FROM
                    "Combination" comb
                GROUP BY
                    song_id,
                    id) c_max
                INNER JOIN "Combination" comb ON c_max.id = comb.id) filterd_comb ON filterd_comb.comb_id = cc.combination_id
    """
    cur.execute(query)
    covers = defaultdict(list)
    song_comb = dict()
    for audio, song_id, comb_id in cur:
        song_comb[song_id] = comb_id
        covers[song_id].append(audio)
    cur.close()
    mydb.close()

    outputs = {
        song_id: {"combination_id": song_comb[song_id], "audios": audios}
        for song_id, audios in covers.items()
    }
    return outputs


def load_output_from_s3():
    try:
        s3 = boto3.resource("s3")
        return pickle.loads(
            s3.Bucket(bucket_name).Object(key_to_pickle).get()["Body"].read()
        )
    except Exception as e:
        print(e)
        return {}


def save_output_to_s3(outputs):
    save_to_s3(outputs, key_to_pickle)


def save_to_s3(output, key):
    try:
        s3 = boto3.resource("s3")
        s3.Bucket(bucket_name).Object(key).put(Body=pickle.dumps(output))
    except Exception as e:
        print(e)
