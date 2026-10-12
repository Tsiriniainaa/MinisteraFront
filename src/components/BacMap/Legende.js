import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import image4 from './img/4.png';
import image1 from './img/1.png';
import image2 from './img/2.png';
import image3 from './img/3.png';

const image = [image1 , image2 , image3 , image4, image4];

const Legende = ({ labelEtatBac, effectif }) => {
  const map = useMap();
  const legend = L.control({ position: "topright" });

    useEffect(() => {
        if(effectif){
            map.removeControl(legend,3);
            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info");
                let labels = [];
                for (let statuts of labelEtatBac) {
                    if(statuts.id == 5){    
                        labels.push(
                            `<b>  
                            <span class="iconLegende"></span>
                            ${statuts.labele} : ${effectif[statuts.id]}
                            </b>`
                            );
                        }
                        else{
                            labels.push(
                            `<b>  
                            <img class="iconLegende" src=${image[statuts.id-1]} />
                            ${statuts.labele} : ${effectif[statuts.id]}
                            </b>`
                            );
                        
                        }
                        console.log(statuts.id);
                    }
                    //console.log(labels);
                    delete labels[0];
                    div.innerHTML = labels.join("<br>");
                    return div;
                };
                legend.addTo(map);
        }
    }, [effectif]);
};


export default Legende;
