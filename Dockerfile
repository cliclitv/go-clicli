FROM alpine:latest
WORKDIR /root/
COPY . .
RUN apk add git
RUN go build -o app
EXPOSE 4000
ENTRYPOINT ["./app"]