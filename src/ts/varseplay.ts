export interface Varse{
    surahId: number,
    verseId: number,
    arabic:string,
    bangla:string
}
interface Range{
    max:number,
    min:number
}
function getAPos(valeu:number, A:Range, B:Range)
{
    let t = (valeu - A.min)/(A.max-A.min);
    let bvaleu = t*(B.max - B.min) + B.min;
    return bvaleu;
}
export default class varsePlay{
    arabicText: HTMLDivElement;
    banglaMening: HTMLDivElement;
    arabic: HTMLParagraphElement;
    bangla: HTMLParagraphElement;
    nextButton: HTMLButtonElement;
    counter: number;
    audioplayer: HTMLVideoElement;
    audios: Blob[];
    autoPaly!: boolean;
    progress: HTMLDivElement;
    audioEnable!: boolean;
    constructor(private elem: HTMLDivElement, public varses: Varse[]){
        let viewsCloser = document.createElement("span");
        viewsCloser.className = "closer";
        viewsCloser.innerHTML = "&times;";
        this.elem.appendChild(viewsCloser);
        viewsCloser.addEventListener("click", (ev)=>{
            document.body.style.overflow = "auto";
            this.elem.classList.remove("show");
            document.removeEventListener("resize",this.resize);
            this.autoPaly = false;
        });
        this.arabicText = document.createElement("div");
        this.arabicText.className = "arabic-text-container arabic-text";
        this.arabic = document.createElement("p");
        this.arabicText.appendChild(this.arabic);
        this.banglaMening = document.createElement("div");
        this.banglaMening.className = "bangla-mening-container bangla-mening";
        this.bangla = document.createElement("p");
        this.banglaMening.appendChild(this.bangla);
        this.nextButton = document.createElement("button");
        this.nextButton.className="btn-next";
        this.nextButton.innerText="Next";
        this.nextButton.addEventListener("click", ()=>this.next())
        this.progress = document.createElement("div");
        this.progress.style.position = "fixed";
        this.progress.style.top = "0px";
        this.progress.style.left = "0px";
        this.progress.style.height = "2px";
        this.progress.style.backgroundColor = "rgba(255, 0,255, 0.8)";
        elem.appendChild(this.arabicText);
        elem.appendChild(this.banglaMening);
        elem.appendChild(this.nextButton);
        elem.appendChild(this.progress);
        this.counter = 1;
        this.audioplayer = document.createElement("video");
        this.audios = Array<Blob>();
        this.resize = this.resize.bind(this);
    }
    loadAudio(varse_id:number=this.counter){
        return new Promise((resove,reason)=>{
            fetch(`/audio?id=${this.varses[0].surahId}&varse=${varse_id}`)
            .then(res => res.blob())
            .then(blob=>{
                this.audios.push(blob)
                resove(true)
            })
            .catch(errr=>{
                console.error(errr);
            })
        })
    }
    playAudio()
    {
        if(this.audios.length != 0)
        {
            this.audioplayer.src = URL.createObjectURL(this.audios.shift())
            this.audioplayer.play();
            this.progress.style.display = "block";
            let pross=setInterval(()=>{
                this.progress.style.width = `${Math.round(this.audioplayer.currentTime/this.audioplayer.duration*100)}%`;
                if(this.audioplayer.duration-this.audioplayer.currentTime <= 0.5 && this.autoPaly && (this.varses.length > this.counter)){
                    if(!this.arabicText.classList.contains("end"))
                    {
                        this.arabicText.classList.add("end");
                    }
                    if(!this.banglaMening.classList.contains("end"))
                    {
                        this.banglaMening.classList.add("end");
                    }
                }
                if(this.audioplayer.ended)
                {
                    clearInterval(pross);
                    this.progress.style.display = "none";
                    this.progress.style.width = "0px"
                }
            }, 100)
            this.audioplayer.addEventListener("ended", ()=>{
                if(this.audioplayer.paused && (this.varses.length > this.counter) && this.autoPaly)
                {
                    this.next();
                }
            });
        }else{
            this.loadAudio().then((load)=>{
                this.playAudio();
            })
        }
    }
    show(varse_id:number, isNext=false, isAutoplay=false, isAudio=true){
        this.autoPaly = isAutoplay;
        this.audioEnable = isAudio;
        this.arabic.innerText = this.varses.filter(varse => varse.verseId == varse_id)[0].arabic;
        this.bangla.innerText = this.varses.filter(varse =>  varse.verseId == varse_id)[0].bangla;
        if(this.arabicText.classList.contains("end"))
        {
            this.arabicText.classList.remove("end");
        }
        if(this.banglaMening.classList.contains("end"))
        {
            this.banglaMening.classList.remove("end");
        }
        this.counter = varse_id;
        if(isAudio)
        {
            if(isNext)
            {
                this.playAudio();
            }else{
                this.audios = Array<Blob>()
                this.playAudio();
            }
        }
        if(this.varses.length <= varse_id)
        {
            this.nextButton.style.display = "none";
        }else{
            this.nextButton.style.display = "block";
            this.loadAudio(varse_id+1)
        }
        document.body.style.overflow = "auto";
        document.location.hash = String(varse_id);
        this.elem.classList.add("show");
        document.body.style.overflow = "hidden";
        this.resize();
        document.addEventListener("resize", ()=>this.resize());
    }
    next(){
        this.counter++;
        this.elem.classList.remove("show");
        this.show(this.counter, true, this.autoPaly, this.audioEnable);
    }
    resize(){
        [this.arabicText, this.banglaMening].map(value=>{
            let textoverflow = value.scrollHeight > value.clientHeight;
            (<HTMLParagraphElement>value.children[0]).style.whiteSpace = "nowrap";
            let imin = 10;
            (<HTMLParagraphElement>value.children[0]).style.fontSize = `${imin}px`;
            let minHeight = (<HTMLParagraphElement>value.children[0]).clientHeight;
            let minWidth = (<HTMLParagraphElement>value.children[0]).clientWidth;
            let imax = 128;
            (<HTMLParagraphElement>value.children[0]).style.fontSize = `${imax}px`;
            let maxHeight =(<HTMLParagraphElement>value.children[0]).clientHeight;
            let maxWidth =(<HTMLParagraphElement>value.children[0]).clientWidth;
            let clientWidth = value.clientWidth-(2*38);
            let clientHeight = value.clientHeight-(2*38);
            let i = imax;
            for(;i > imin;i--)
            {
                let itOk = true;
                let w = getAPos(i, {max:imax, min:imin}, {max:maxWidth, min:minWidth});
                let h = getAPos(i, {max:imax, min:imin}, {max:maxHeight, min:minHeight});
                let line = 1;
                while(w/line >= clientWidth)
                {
                    if(h*(line+1) >= clientHeight)
                    {
                        itOk = false
                        break;
                    }
                    line++;
                }
                if(itOk)
                break;
            }
            // for(let l=1;true;l++)
            // {
            //     let w = getAPos(i, {max:imax, min:imin}, {max:maxWidth, min:minWidth});
            //     let itOk = true;
            //     while(w/l >= clientWidth)
            //     {
            //         i--;
            //         if(i > imin)
            //         {
            //             itOk = false;
            //         }else{
            //             itOk = false;
            //             i = imax;
            //             break;
            //         }
            //         w = getAPos(i, {max:imax, min:imin}, {max:maxWidth, min:minWidth});
            //     }
            //     if(itOk)
            //         {
            //             console.log("Line: "+l);
            //             break
            //         }
            // }
            (<HTMLParagraphElement>value.children[0]).style.fontSize = `${i}px`;
            // let clHeight = value.clientHeight;
            // let pW = value.children[0].clientWidth;
            // let pH = value.children[0].clientHeight;
            // let lines = clWidth;
            // let lines = value.children[0].clientWidth/value.clientWidth;
            // if(lines >= value.clientHeight/value.children[0].clientHeight-1)
            // {
            //     lines = value.clientHeight/value.children[0].clientHeight-1;
            //     i = (i*value.clientWidth)/(value.children[0].clientWidth/lines);
            // }else
            // i = (i*value.clientWidth)/(value.children[0].clientWidth);
            // (<HTMLParagraphElement>value.children[0]).style.fontSize = `${Math.round(i)}px`;
            // console.log(i);
            (<HTMLParagraphElement>value.children[0]).style.whiteSpace = "normal";
        })
    }
}
