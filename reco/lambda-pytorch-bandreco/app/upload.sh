aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 935612526145.dkr.ecr.ap-northeast-2.amazonaws.com
docker build -t lambda-pytorch-colaboai-reco .
docker tag lambda-pytorch-colaboai-reco:latest 935612526145.dkr.ecr.ap-northeast-2.amazonaws.com/lambda-pytorch-colaboai-reco:latest
docker push 935612526145.dkr.ecr.ap-northeast-2.amazonaws.com/lambda-pytorch-colaboai-reco:latest
