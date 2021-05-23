import "../scss/style.scss";
import "bootstrap";
import Surah from "./surah"
var surahs = document.querySelector(".surahs");
if(surahs){
    let surahWapper = surahs;
    fetch("/surah_names")
    .then(res=>res.json())
    .then(json => {
        [...json].map((value, index)=>{
            let all = document.createElement("a");
            all.className = "list-group-item list-group-item-action";
            all.id = index.toString();
            all.href = "/viewsurah?id="+value.surah_no;
            all.innerHTML=
            `<div class="row">
                <div class="col">
                    <div class="row">${value.name_bangla}</div>
                    <div class="row text-muted">আয়াত সংখ্যা: ${value.ayah_number}</div>
                </div>
                <div class="col-4 text-right arabic">
                    ${value.name_arabic}
                </div>
            </div>`;
            surahWapper.append(all)
            // if(index == 0)
            //     console.log(value);
            
        })
    })
}

var avarse = document.querySelector<HTMLElement>(".averse");
if(avarse)
{
    let varse = avarse;
    new Surah(varse)
}