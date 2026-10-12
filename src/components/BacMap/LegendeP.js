import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import image4 from './img2/0.png';
import image1 from './img2/0.png';
import image2 from './img2/1.png';
import image3 from './img2/2.png';

const image = [image1, image2, image3, image4, image4];

const LegendeP = ({ labelEtatBac, effectif }) => {
    const map = useMap();
    const legendRef = useRef(null);

    useEffect(() => {
        if (effectif && labelEtatBac) {
            // Remove the existing legend if it exists
            if (legendRef.current) {
                map.removeControl(legendRef.current);
            }

            // Create a new legend control
            legendRef.current = L.control({ position: "topright" });

            legendRef.current.onAdd = () => {
                const div = L.DomUtil.create("div", "info");
                let labels = [];
                for (let statuts of labelEtatBac) {
                    labels.push(
                        `<b>  
                            <img class="iconLegende" src="${image[statuts.id]}" />
                            ${statuts.labele} : ${effectif[statuts.id]}
                        </b>`
                    );
                    console.log(statuts.id);
                }
                div.innerHTML = labels.join("<br>");
                return div;
            };

            // Add the new legend to the map
            legendRef.current.addTo(map);
        }

        // Cleanup function to remove the legend on unmount
        return () => {
            if (legendRef.current) {
                map.removeControl(legendRef.current);
                legendRef.current = null;
            }
        };
    }, [effectif, labelEtatBac, map]);

    return null; // This component does not render anything directly
};

export default LegendeP;
