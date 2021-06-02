import intToBan from "./numberToban";
import varsePlay, { Varse } from "./varseplay";
interface Option{
    innner:string,
    action: ((ev: MouseEvent) => any)
}
export default class Surah{
    public surahId: string;
    private ayan_num!: number;
    private surah_name!:{bangla:string, arabic:string};
    private surah_type!:string;
    private options: Array<Option>;
    loadCount: number;
    controls!: HTMLDivElement;
    views: HTMLDivElement;
    varses!: Varse[];
    currentVarseToAction!: number;
    player!: varsePlay;
    constructor(private elem:HTMLElement){
        this.surahId = elem.dataset.suraid!;
        fetch("/surah_names?id="+this.surahId)
        .then(res=>res.json())
        .then(json=>{
            this.ayan_num = json[0].ayah_number;
            this.surah_name = {bangla:json[0].name_bangla, arabic:json[0].name_arabic};
            this.surah_type = json[0].type;
            this.loadhead();
        })
        this.loadCount = 1;
        this.actionA = this.actionA.bind(this);
        this.actionC = this.actionC.bind(this);
        this.actionB = this.actionB.bind(this);
        this.options = Array();
        this.options.push({innner:"A", action:this.actionA})
        this.options.push({innner:"B", action:this.actionB})
        this.options.push({innner:"C", action:this.actionC})
        this.views = document.querySelector<HTMLDivElement>(".extra-container")!;
    }
    actionA(ev: MouseEvent) {
        this.controls.classList.toggle("show");
        this.player.show(this.currentVarseToAction, false, false, false);
    }
    actionB(ev: MouseEvent) {
        this.controls.classList.toggle("show");
        this.player.show(this.currentVarseToAction, false, true);
    }
    actionC(ev: MouseEvent) {
        this.controls.classList.toggle("show");
        this.player.show(this.currentVarseToAction);
    }
    loadhead() {
        let h1 = document.createElement("h1");
        h1.innerText = this.surah_name.bangla
        this.controls = document.createElement("div");
        this.controls.className = "controls";
        let ul = document.createElement("ul");
        this.options.map((value,index)=>{
            let li = document.createElement("li");
            li.innerHTML = value.innner;
            li.addEventListener("click", value.action);
            ul.appendChild(li);
        })
        this.controls.appendChild(ul);
        this.controls.style.zIndex = "1024";
        document.addEventListener("scroll", (ev)=>{
            this.controls.classList.remove("show")
        })
        this.elem.before(h1);
        this.elem.before(this.controls);
        this.varses = Array<Varse>();
        this.loadAyat()
    }
    loadAyat(){
        fetch("/quran?id="+this.surahId+"&varse="+this.loadCount)
        .then(res=>res.json())
        .then(json=>{
            this.varses.push({verseId: Number(json[0].verse_id), surahId: Number(json[0].surah_id), arabic:json[0].arabic.toString(), bangla:json[0].bn_bayan.toString()})
            let card= document.createElement("div");
            card.className = "card mb-2 qu-ayat";
            card.id = json[0].verse_id;
            let cardBody = document.createElement("div");
            cardBody.className = "card-body text-center";
            let p1 = document.createElement("p");
            p1.className = "card-text arabic-text";
            p1.innerText = json[0].arabic;
            let p2 = document.createElement("p");
            p2.className = "card-text bangla-meaning";
            p2.innerText = json[0].bn_bayan;
            let ids = document.createElement("span");
            ids.className = "varse_number";
            ids.innerText = intToBan(Number(json[0].verse_id));

            cardBody.appendChild(p1);
            cardBody.appendChild(document.createElement("hr"));
            cardBody.appendChild(ids);
            cardBody.appendChild(p2);
            // card.appendChild(controls)
            card.appendChild(cardBody);
            card.addEventListener("click", (ev)=>{
                this.controls.classList.toggle("show");
                if(this.controls.classList.contains("show"))
                {
                    this.controls.style.top = card.getBoundingClientRect().top+"px";
                    this.currentVarseToAction = Number(json[0].verse_id);
                }
            })
            this.elem.appendChild(card);
            // console.log(json);
            if(this.loadCount==1)
            {
                this.player = new varsePlay(this.views,this.varses);
            }
            this.loadCount++;
            if(this.loadCount <= this.ayan_num)
            {
                this.loadAyat()
            }else{
                (<any>window).varses = this.varses;
            }
            this.player.varses = this.varses;
        })
    }
}