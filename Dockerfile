FROM plugins/base:linux-amd64
COPY app /bin/
RUN ls
ENTRYPOINT ["/bin/app"]