FROM alpine:lates
WORKDIR /root/
COPY . .
RUN ls
EXPOSE 8080
ENTRYPOINT ["./go-clicli"]