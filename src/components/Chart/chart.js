
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';
import { Col } from 'react-bootstrap';
import ServiceTache from '../Tache/Service';

HighchartsGantt(Highcharts);
export default function Chart({ departement }) {

    const [dataGantt, setdataGantt] = useState([]);



    useEffect(() => {
        ServiceTache.getGantt(departement.id)
            .then(rep => {
                console.log(rep.data);
                setdataGantt(rep.data);
            })
            .catch(err => {
                console.log('effect use', err);
                alert(err);
            })
    }, []);

    console.log('jsjs', dataGantt);
    const dateInMilliseconds = 86400000;
    const now = new Date().getTime();
    // console.log('sasa', projet);

    // console.log('lijo', dataGantt);
    var today = new Date(),
        day = 1000 * 60 * 60 * 24;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    // today = today.getTime();

    const chartOptions = {
        title: {
            text: `${departement.intitule}`
        },
        // xAxis: {
        //     min: today.getTime() - (2 * day),
        //     max: today.getTime() + (32 * day)
        // },
        xAxis: [
            {
                type: "datetime",
                currentDateIndicator: true,
                dateTimeLabelFormats: {
                    day: "%d"
                },
                tickInterval: dateInMilliseconds,
                max: new Date(20 * dateInMilliseconds + now).getTime(),
                min: new Date(-40 * dateInMilliseconds + now).getTime(),
                minRange: 10 * dateInMilliseconds
            },
            {
                type: "datetime",
                tickInterval: dateInMilliseconds * 30,
                dateTimeLabelFormats: {
                    month: "%m/%Y"
                }
            }
        ],
        accessibility: {
            keyboardNavigation: {
                seriesNavigation: {
                    mode: 'serialize'
                }
            },
            point: {
                descriptionFormatter: function (point) {
                    var completedValue = point.completed ?
                        point.completed.amount || point.completed : null,
                        completed = completedValue ?
                            ' Task completed ' + Math.round(completedValue * 1000) / 10 + '%.' :
                            '';
                    return Highcharts.format(
                        '{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}.',
                        { point, completed }
                    );
                }
            }
        },
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
                }
            }
        },
        navigator: {
            enabled: true
        },
        scrollbar: {
            enabled: true
        },
        rangeSelector: {
            enabled: true,
            selected: 0,
        },


        series: [{
            name: 'Project 1',
            data: dataGantt,
            // data:
            //     [
            //         {
            //             name: ' Préalables et préparatifs de lancement',
            //             id: 'parent1',
            //             start: today.getTime() + (10 * day),
            //             end: today.getTime() + (30 * day),
            //             // code: "11111afsf1111",
            //             completed: 0.25,
            //             fontSymbol: 'exclamation',
            //             accessibility: {
            //                 description: 'Exclamation symbol.'
            //             }
            //         }]

            //     {
            //         name: 'Sessions de formation théorique et pratique',
            //         id: 'planning',
            //         parent: 'parent1',
            //         start: today.getTime(),
            //         end: today.getTime() + (20 * day),
            //         // code: "11111afsfs1111",
            //         // nbudget: 1,
            //         // completed: {
            //         //     amount: 0.12,
            //         //     fill: '#fa0'
            //         // }
            //     },
            //     {
            //         name: 'Renforcement des compétences techniques de producteurs de plantes aromatiques certifiées biologiques et équitables ',
            //         id: 'renfonrcement',
            //         parent: 'parent1',
            //         start: today.getTime(),
            //         end: today.getTime() + (20 * day),
            //         // code: "111111111",
            //         // nbudget: 1,
            //         // dependency: 'planning',
            //     },
            //     {
            //         name: 'Préparation des TDR',
            //         id: 'requirements',
            //         parent: 'planning',
            //         start: today.getTime(),
            //         end: today.getTime() + (5 * day),
            //         // code: "11afafaf11",
            //         // nbudget: 1
            //     },
            //     {
            //         name: 'Avis d\'appel d\'offres pour la formation (insertion dans les journaux, dépouillement, octroi du marché, …)',
            //         id: 'avis',
            //         parent: 'planning',
            //         start: today.getTime(),
            //         end: today.getTime() + (5 * day),
            //         // code: "afdafaf1",
            //         // nbudget: 1
            //     },
            // ]
        }]
    };

    // const chartOptionss = {
    //     series: [{
    //         name: 'Offices',
    //         data: [{
    //             name: 'New offices',
    //             id: 'new_offices',
    //             owner: 'Peter'
    //         }, {
    //             name: 'Prepare office building',
    //             id: 'prepare_building',
    //             parent: 'new_offices',
    //             start: today - (2 * day),
    //             end: today + (6 * day),
    //             completed: {
    //                 amount: 0.2
    //             },
    //             owner: 'Linda'
    //         }, {
    //             name: 'Inspect building',
    //             id: 'inspect_building',
    //             dependency: 'prepare_building',
    //             parent: 'new_offices',
    //             start: today + 6 * day,
    //             end: today + 8 * day,
    //             owner: 'Ivy'
    //         }, {
    //             name: 'Passed inspection',
    //             id: 'passed_inspection',
    //             dependency: 'inspect_building',
    //             parent: 'new_offices',
    //             start: today + 9.5 * day,
    //             milestone: true,
    //             owner: 'Peter'
    //         }, {
    //             name: 'Relocate',
    //             id: 'relocate',
    //             dependency: 'passed_inspection',
    //             parent: 'new_offices',
    //             owner: 'Josh'
    //         }, {
    //             name: 'Relocate staff',
    //             id: 'relocate_staff',
    //             parent: 'relocate',
    //             start: today + 10 * day,
    //             end: today + 11 * day,
    //             owner: 'Mark'
    //         }, {
    //             name: 'Relocate test facility',
    //             dependency: 'relocate_staff',
    //             parent: 'relocate',
    //             start: today + 11 * day,
    //             end: today + 13 * day,
    //             owner: 'Anne'
    //         }, {
    //             name: 'Relocate cantina',
    //             dependency: 'relocate_staff',
    //             parent: 'relocate',
    //             start: today + 11 * day,
    //             end: today + 14 * day
    //         }]
    //     }, {
    //         name: 'Product',
    //         data: [{
    //             name: 'New product launch',
    //             id: 'new_product',
    //             owner: 'Peter'
    //         }, {
    //             name: 'Development',
    //             id: 'development',
    //             parent: 'new_product',
    //             start: today - day,
    //             end: today + (11 * day),
    //             completed: {
    //                 amount: 0.6,
    //                 fill: '#e80'
    //             },
    //             owner: 'Susan'
    //         }, {
    //             name: 'Beta',
    //             id: 'beta',
    //             dependency: 'development',
    //             parent: 'new_product',
    //             start: today + 12.5 * day,
    //             milestone: true,
    //             owner: 'Peter'
    //         }, {
    //             name: 'Final development',
    //             id: 'finalize',
    //             dependency: 'beta',
    //             parent: 'new_product',
    //             start: today + 13 * day,
    //             end: today + 17 * day
    //         }, {
    //             name: 'Launch',
    //             dependency: 'finalize',
    //             parent: 'new_product',
    //             start: today + 17.5 * day,
    //             milestone: true,
    //             owner: 'Peter'
    //         }]
    //     }],
    //     tooltip: {
    //         pointFormatter: function () {
    //             var point = this,
    //                 format = '%e. %b',
    //                 options = point.options,
    //                 completed = options.completed,
    //                 amount = isObject(completed) ? completed.amount : completed,
    //                 status = ((amount || 0) * 100) + '%',
    //                 lines;

    //             lines = [{
    //                 value: point.name,
    //                 style: 'font-weight: bold;'
    //             }, {
    //                 title: 'Start',
    //                 value: dateFormat(format, point.start)
    //             }, {
    //                 visible: !options.milestone,
    //                 title: 'End',
    //                 value: dateFormat(format, point.end)
    //             }, {
    //                 title: 'Completed',
    //                 value: status
    //             }, {
    //                 title: 'Owner',
    //                 value: options.owner || 'unassigned'
    //             }];

    //             return lines.reduce(function (str, line) {
    //                 var s = '',
    //                     style = (
    //                         defined(line.style) ? line.style : 'font-size: 0.8em;'
    //                     );
    //                 if (line.visible !== false) {
    //                     s = (
    //                         '<span style="' + style + '">' +
    //                         (defined(line.title) ? line.title + ': ' : '') +
    //                         (defined(line.value) ? line.value : '') +
    //                         '</span><br/>'
    //                     );
    //                 }
    //                 return str + s;
    //             }, '');
    //         }
    //     },
    //     title: {
    //         text: 'Gantt Project Management'
    //     },
    //     xAxis: {
    //         currentDateIndicator: true,
    //         min: today - 3 * day,
    //         max: today + 18 * day
    //     },
    //     accessibility: {
    //         keyboardNavigation: {
    //             seriesNavigation: {
    //                 mode: 'serialize'
    //             }
    //         },
    //         point: {
    //             descriptionFormatter: function (point) {
    //                 var completedValue = point.completed ?
    //                     point.completed.amount || point.completed : null,
    //                     completed = completedValue ?
    //                         ' Task ' + Math.round(completedValue * 1000) / 10 + '% completed.' :
    //                         '',
    //                     dependency = point.dependency &&
    //                         point.series.chart.get(point.dependency).name,
    //                     dependsOn = dependency ? ' Depends on ' + dependency + '.' : '';

    //                 return Highcharts.format(
    //                     point.milestone ?
    //                         '{point.yCategory}. Milestone at {point.x:%Y-%m-%d}. Owner: {point.owner}.{dependsOn}' :
    //                         '{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}. Owner: {point.owner}.{dependsOn}',
    //                     { point, completed, dependsOn }
    //                 );
    //             }
    //         }
    //     },
    //     lang: {
    //         accessibility: {
    //             axis: {
    //                 xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
    //             }
    //         }
    //     }
    // }







    return (
        <Col md={12}>

            <HighchartsReact
                highcharts={Highcharts}
                constructorType="ganttChart"
                options={chartOptions}
            />
        </Col>
    );
}
