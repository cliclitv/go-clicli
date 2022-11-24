FROM alpine:latest
WORKDIR /root/
COPY . .
RUN ls
EXPOSE 4000
ENTRYPOINT ["./go-clicli"]