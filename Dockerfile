FROM alpine:latest
WORKDIR /root/
EXPOSE 8080
ENTRYPOINT ["./app"]