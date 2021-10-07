FROM golang:alpine AS dev
WORKDIR $GOPATH/src
COPY . .
RUN go build -o app

FROM alpine:latest AS prod
WORKDIR /root/
COPY --from=dev /go/src/app .
EXPOSE 8080
ENTRYPOINT ["./app"]
