const bangNumMap = ["০", "১", "২","৩","৪","৫","৬","৭","৮", "৯"]
export default function intToBan(num:number){
        let numb = num.toString();
        let out = "";
        for(let i = 0; i < numb.length; i++)
        {
            out = out+bangNumMap[Number(numb[i])]
        }
        return out;
}