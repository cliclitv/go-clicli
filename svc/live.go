package svc

import (
	"flag"
	"fmt"
	"net"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/signal"
	"syscall"

	"time"

	_ "net/http/pprof"

	"io/ioutil"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/cliclitv/clicli-live/av"
	"github.com/cliclitv/clicli-live/container/flv"
	"github.com/cliclitv/clicli-live/protocol/hls"
	"github.com/cliclitv/clicli-live/protocol/httpflv"
	"github.com/cliclitv/clicli-live/protocol/httpopera"
	"github.com/cliclitv/clicli-live/protocol/rtmp"
)

const (
	programName = "clicli-live"
	VERSION     = "0.0.1"
)

var (
	buildTime string
	prof      = flag.String("pprofAddr", "", "golang pprof debug address.")
	rtmpAddr  = flag.String("rtmpAddr", ":1935", "The rtmp server address to bind.")
	flvAddr   = flag.String("flvAddr", ":8081", "the http-flv server address to bind.")
	hlsAddr   = flag.String("hlsAddr", ":8080", "the hls server address to bind.")
	operaAddr = flag.String("operaAddr", "", "the http operation or config address to bind: 8082.")
	flvDvr    = flag.Bool("flvDvr", false, "enable flv dvr")
)

var (
	Getters []av.GetWriter
)

func BuildTime() string {
	return buildTime
}

func init() {
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "%s Version[%s]\r\nUsage: %s [OPTIONS]\r\n", programName, VERSION, os.Args[0])
		flag.PrintDefaults()
	}
	flag.Parse()
}

func catchSignal() {
	// windows unsupport syscall.SIGSTOP
	sig := make(chan os.Signal)
	signal.Notify(sig, syscall.SIGTERM)
	<-sig
	fmt.Println("recieved signal!")
	// select {}
}

func StartLive() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("main panic: ", r)
			time.Sleep(1 * time.Second)
		}
	}()

	stream := rtmp.NewRtmpStream()

	// hls
	startHls()
	// flv dvr
	startFlvDvr()
	// rtmp
	startRtmp(stream, Getters)
	// http-flv
	startHTTPFlv(stream)
	// http-opera
	startHTTPOpera(stream)
	// pprof
	startPprof()
	// my log
	mylog()
	// block
	catchSignal()
}

func startHls() *hls.Server {
	hlsListen, err := net.Listen("tcp", *hlsAddr)
	if err != nil {
		fmt.Println(err)
	}

	hlsServer := hls.NewServer()
	go func() {
		defer func() {
			if r := recover(); r != nil {
				fmt.Println("hls server panic: ", r)
			}
		}()
		hlsServer.Serve(hlsListen)
	}()
	Getters = append(Getters, hlsServer)
	return hlsServer
}

func startRtmp(stream *rtmp.RtmpStream, getters []av.GetWriter) {
	rtmplisten, err := net.Listen("tcp", *rtmpAddr)
	if err != nil {
		fmt.Println(err)
	}

	rtmpServer := rtmp.NewRtmpServer(stream, getters)
	go func() {
		defer func() {
			if r := recover(); r != nil {
				fmt.Println("hls server panic: ", r)
			}
		}()
		rtmpServer.Serve(rtmplisten)
	}()
}

func startHTTPFlv(stream *rtmp.RtmpStream) {
	flvListen, err := net.Listen("tcp", *flvAddr)
	if err != nil {
		fmt.Println(err)
	}

	hdlServer := httpflv.NewServer(stream)
	go func() {
		defer func() {
			if r := recover(); r != nil {
				fmt.Println("hls server panic: ", r)
			}
		}()
		hdlServer.Serve(flvListen)
	}()
}

func startHTTPOpera(stream *rtmp.RtmpStream) {
	if *operaAddr != "" {
		opListen, err := net.Listen("tcp", *operaAddr)
		if err != nil {
			fmt.Println(err)
		}
		opServer := httpopera.NewServer(stream)
		go func() {
			defer func() {
				if r := recover(); r != nil {
					fmt.Println("hls server panic: ", r)
				}
			}()
			opServer.Serve(opListen)
		}()
	}
}

func startFlvDvr() {
	if *flvDvr {
		fd := new(flv.FlvDvr)
		Getters = append(Getters, fd)
	}
}

func startPprof() {
	if *prof != "" {
		go func() {
			if err := http.ListenAndServe(*prof, nil); err != nil {
				fmt.Println("enable pprof failed: ", err)
			}
		}()
	}
}

func mylog() {
	fmt.Println("")
	fmt.Printf("SMS Version:  %s\tBuildTime:  %s\n", VERSION, BuildTime())
	fmt.Printf("SMS Start, Rtmp Listen On %s\n", *rtmpAddr)
	fmt.Printf("SMS Start, Hls Listen On %s\n", *hlsAddr)
	fmt.Printf("SMS Start, HTTP-flv Listen On %s\n", *flvAddr)
	if *operaAddr != "" {
		fmt.Printf("SMS Start, HTTP-Operation Listen On %s\n", *operaAddr)
	}
	if *prof != "" {
		fmt.Printf("SMS Start, Pprof Server Listen On %s\n", *prof)
	}
	if *flvDvr {
		fmt.Printf("SMS Start, Flv Dvr Save On [%s]", "app/streamName.flv")
	}
	SavePid()
}

var CurDir string

func init() {
	CurDir = getParentDirectory(getCurrentDirectory())
}
func getParentDirectory(dirctory string) string {
	return substr(dirctory, 0, strings.LastIndex(dirctory, "/"))
}
func getCurrentDirectory() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		fmt.Println(err)
	}
	return strings.Replace(dir, "\\", "/", -1)
}
func substr(s string, pos, length int) string {
	runes := []rune(s)
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}
	return string(runes[pos:l])
}
func SavePid() error {
	pidFilename := CurDir + "/pid/" + filepath.Base(os.Args[0]) + ".pid"
	pid := os.Getpid()
	return ioutil.WriteFile(pidFilename, []byte(strconv.Itoa(pid)), 0755)
}