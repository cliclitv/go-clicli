FROM alpine:latest
WORKDIR /root/
COPY . .
RUN ls
ENTRYPOINT ["./go-clicli"]