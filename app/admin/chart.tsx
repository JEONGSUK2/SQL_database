'use client'
import { Bar } from 'react-chartjs-2';
import  Chart, { registerables, BarElement, CategoryScale, LinearScale} from 'chart.js/auto';


export default function ChartCom(){
    Chart.register(...registerables, BarElement, CategoryScale, LinearScale)
    const data = {
        labels : ['orange','orangered','green'],
        datasets : [
            {
                label : "차트",
                data: [10,50,5],
                backgroundColor : [
                    'rgba(255,99,132,0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                ],
                borderWidth: 1
            }
        ]
    }
    const options ={
           Animation: {
            tension:{
                duration: 1000,
                easing: "easeOutBounce",
                from: 1,
                to: 0,
            }
           },
           scales:{
            y: {
                beginAtZero : true,
                min: 0,
                max: 100,
            }
           }
    }
    return(
        <>
         <Bar data={data} options={options}/>   
        </>
    )
}