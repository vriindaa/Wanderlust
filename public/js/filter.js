//filter.ejs script
let switchBtn = document.getElementById("flexSwitchCheckDefault");
    switchBtn.addEventListener("click",()=>{
        let info = document.getElementsByClassName("tax-info");
        for(let i of info){
          if(i.style.display != "inline"){
              i.style.display = "inline";
          }else{
              i.style.display = "none";
          }
        }
})