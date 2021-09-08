const data = [{
    date: '2021-05-04Е09:50:20',
    'Агломерат ЗСМК крупный': '23,9',
    'Агломерат ЗСМК мелкий': '43,2',
    'Агломерат складской': '8,8',
    'Окатыши карельские НО': '17,7'
}, {
    date: '2021-05-04T10:30:40',
    'Агломерат ЗСМК крупный': '26,2',
    'Агломерат ЗСМК мелкий': '42,8',
    'Агломерат складской': '16,9',
    'Окатыши карельские НО': '16,3'
}, {
    date: '2021-05-04T13:01:01',
    'Агломерат ЗСМК крупный': '26,9',
    'Агломерат ЗСМК мелкий': '43,3',
    'Агломерат складской': '30,9',
    'Окатыши карельские НО': '14,4'
}, {
    date: '2021-05-04T11:05:52',
    'Агломерат ЗСМК крупный': '27,2',
    'Агломерат ЗСМК мелкий': '43,8',
    'Агломерат складской': '16,6',
    'Окатыши карельские НО': '13,8'
}, {
    date: '2021-05-04T11:44:28',
    'Агломерат ЗСМК крупный': '27,3',
    'Агломерат ЗСМК мелкий': '43,9',
    'Агломерат складской': '16,4',
    'Окатыши карельские НО': '13,6'
}, {
    date: '2021-05-04T12:26:10',
    'Агломерат ЗСМК крупный': '27,4',
    'Агломерат ЗСМК мелкий': '44,3',
    'Агломерат складской': '16,8',
    'Окатыши карельские НО': '13,5'
}]


const Diagram = (function () {

    const optionsTime = {
        hour: "2-digit",
        minute: "2-digit"
    };

    const optionsDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const options = {
        series: undefined,
        chart: {
            type: 'bar',
            height: 700,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 2
            },
        },
        xaxis: {
            type: 'string',
            categories: undefined,
        },
        legend: {
            position: 'bottom',
        },
        fill: {
            opacity: 1
        }
    };

    const setName = new Set(),
          chartEl = document.querySelector("#chart");

    let chart;

    function initialization(data) {
        const categories = {};
        setName.clear();

        for (let {date, ...all} of data) {
            for (let name in all) {
                setName.add(name);
            }
        }

        for (let {date, ...all} of data) {
            let localeDate = date;

            if (isNaN(Date.parse(localeDate))) {
                localeDate = localeDate.replace(/(\d+-\d+-\d+)\S(\d+:\d+:\d+)/y, '$1T$2');

                if (isNaN(Date.parse(localeDate))) {
                    console.error('wrong date');
                    continue;
                }
            }

            localeDate = new Date(localeDate);

            const timeString = localeDate.toLocaleTimeString('de-DE', optionsTime),
                  dateString = localeDate.toLocaleDateString('de-DE', optionsDate);

            localeDate = dateString + ' ' + timeString;

            if (!(localeDate in categories)) {
                categories[localeDate] = {};
            }
   
            for (let name of setName) {
                categories[localeDate][name] = all[name]?.toString().replace(/,/g, '.').toString() || (categories[localeDate][name] || 0);
            }
        }

        const categoriesArr = Object.keys(categories).sort(),
              series = [];

        for (let name of setName) {
            let seriesElement = {
                name: name,
                data: []
            }

            for (const date of categoriesArr) {
                seriesElement.data.push(categories[date][name]);
            }

            series.push(seriesElement);
        }
       
        options.series = series;
        options.xaxis.categories = categoriesArr;
    }

    return class {

        static renderDiagram(data) {
            initialization(data);
            chart = new ApexCharts(chartEl, options);
            chart.render()
        };

        static changeData(newData) {

            if(!('date' in newData)){
                console.error('missing date field');
                return;
            }

            if(Object.values(newData).length < 2){
                console.error('must specify at least 1 value');
                return;
            }
            
            data.push(newData);
            initialization(data);
            chart.updateOptions(options);
        }
    }
})()


Diagram.renderDiagram(data);



console.log(`Класс Diagram имеет статичный метод changeData(), который единственным параметром
принимает объект у которого первым свойством "date" должна быть (категория по оси X) строка 
даты в формате ISO. Во всех последующих свойствах в качестве ключа указывается название категории,
а в качестве значения строковое ("1") или числовое значение которое вы хотите присвоить категории, если
нужно удалить категорию необходимо установить это значение в 0.`);


setTimeout(() => {
    Diagram.changeData({
        date: '2021-05-04T13:01:01',
        'Агломерат ЗСМК крупный': '10',
        'Агломерат ЗСМК мелкий': '15,3',
        'Агломерат складской': '56,9',
        'Окатыши карельские НО': '1'
    })
}, 4000);

setTimeout(() => {
    Diagram.changeData({
        date: '2030-05-04T19:01:01',
        'Агломерат ЗСМК крупный': '0',
        'Агломерат ЗСМК мелкий': '0',
        'Агломерат складской': '3,5',
        'Окатыши карельские НО': '21.6'
    })
}, 7000);

setTimeout(() => {
    Diagram.changeData({
        date: '2021-05-04T11:05:52',
        'Агломерат ЗСМК крупный': '8',
        'Окатыши карельские НО': '12.6'
    })
}, 10000);

setTimeout(() => {
    Diagram.changeData({
        date: '1021-05-04T11:05:52',
        'Агломерат ЗСМК крупный': '20',
        'Окатыши карельские НО': '100'
    })
}, 13000);



