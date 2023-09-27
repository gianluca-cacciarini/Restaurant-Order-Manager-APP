var db_items_week = {};
var db_items_day = {};
var db_items_month = {};
var db_items_year = {};

var db_revenue_week = {};
var db_revenue_day = {};
var db_revenue_month = {};
var db_revenue_year = {};

var input_str;

var filter_option = [];

var last_filter = "week";
var last_date = "2023-12-2";
var chart_type = 'pie';
var chart_category_filter = 'category';

function loading(input){
    input_str = input;

    min_date = get_min_date(input_str);

    filter_option.push("2023");
    document.getElementById("2023").style.background="#50C878";
    //testing();
    fill_datasets(min_date);
    create_datasets(input);
}

function get_min_date(input_str){

    min_date = new Date().getTime();

    for(i in input_str){
        date = input_str[i]['date'];
        current_date = new Date(date).getTime();
        if(current_date<min_date){
            min_date = current_date;
        }
    }
    return min_date;
}

function get_date(){
    d = new Date();
    year = d.getFullYear();
    month = parseInt(d.getMonth())+1;
    if(month<10){
        month="0"+month.toString();
    }
    day = d.getDate();
    if(day<10){
        day="0"+day.toString();
    }
    date = year.toString()+"-"+month.toString()+"-"+day.toString();
    return date;
}

function get_info(str_date){
    d = new Date(str_date);
    year = d.getFullYear();
    month = parseInt(d.getMonth())+1;
    if(month<10){
        month="0"+month.toString();
    }
    day = d.getDate();
    if(day<10){
        day="0"+day.toString();
    }
    date = year.toString()+"-"+month.toString()+"-"+day.toString();
    
    if(day<=7) week=1;
    else if(day<=14) week=2;
    else if(day<=21) week=3;
    else if(day<=28) week=4;
    else week=5;
    
    return [year,month,day,week];
}

function get_diff_days(str_day){
    
    today = new Date();
    day = new Date(str_day);
    diff_time = Math.abs(today-day);
    diff_days = Math.ceil(diff_time/ (1000*60*60*24));

    return diff_days;
}

function setOption(id){
    let button = document.getElementById(id);
    if(filter_option.includes(id)){
        var index = filter_option.indexOf(id);
        if (index !== -1) {
            filter_option.splice(index, 1);
        }
        button.style.background="#fff";
    }
    else{
        filter_option.push(id);
        button.style.background="#50C878";
    }
    filter_option.sort();
}


function fill_datasets(min_date){

    start_date = new Date(min_date).getTime();
    end_date = new Date(2024, 11, 31).getTime();
    mills_in_a_day = 1000*60*60*24;
    total_day= parseInt(Math.ceil((end_date-start_date)/mills_in_a_day));

    
    current_timestamp = start_date;
    for(let i=0; i<total_day; i++){
        x = new Date(current_timestamp);
        y = x.getFullYear();
        m = x.getMonth()+1;
        d = x.getDate();
        str_year = y.toString();
        if(m<10){
            str_month=str_year+"-"+"0"+m.toString();
        }
        else{
            str_month =str_year+"-"+m.toString();
        }
        if(d<10){
            str_day=str_month+"-"+"0"+d.toString();
        }
        else{
            str_day=str_month+"-"+d.toString();
        }
        if(d>=1 && d<=7) str_week=str_month+"-1";
        if(d>7 && d<=14) str_week=str_month+"-2";
        if(d>14 && d<=21) str_week=str_month+"-3";
        if(d>21 && d<=28) str_week=str_month+"-4";
        if(d>28) str_week=str_month+"-5";

        current_timestamp += mills_in_a_day;

        if(!db_revenue_year[str_year]){
            db_revenue_year[str_year] = 0;
        }
        if(!db_items_year[str_year]){
            db_items_year[str_year] = [{},{}];
        }
        if(!db_revenue_month[str_month]){
            db_revenue_month[str_month] = 0;
        }
        if(!db_items_month[str_month]){
            db_items_month[str_month] = [{},{}];
        }
        if(!db_revenue_day[str_day]){
            db_revenue_day[str_day] = 0;
        }
        if(!db_items_day[str_day]){
            db_items_day[str_day] = [{},{}];
        }
        if(!db_revenue_week[str_week]){
            db_revenue_week[str_week] = 0;
        }
        if(!db_items_week[str_week]){
            db_items_week[str_week] = [{},{}];
        }

    }

}

function update_item(diz,date,name,quantity,new_cost){
    if( !('total_cost' in diz[date][0]) ){
        diz[date][0]['total_cost'] = 0;
    }
    if( !(name in diz[date][0]) ){
        diz[date][0][name] = [quantity,new_cost];
        prev_item_total_cost = parseFloat(diz[date][0]['total_cost']).toFixed(2);
        diz[date][0]['total_cost'] = (parseFloat(prev_item_total_cost)+parseFloat(new_cost)).toFixed(2);
    }
    else{
        prev_quantity_value = parseInt(diz[date][0][name][0]);
        prev_item_value = parseFloat(diz[date][0][name][1]).toFixed(2);
        prev_item_total_cost = parseFloat(diz[date][0]['total_cost']).toFixed(2);
        diz[date][0][name][0] = parseInt(prev_quantity_value)+parseInt(quantity);
        diz[date][0][name][1] = (parseFloat(prev_item_value)+parseFloat(new_cost)).toFixed(2);
        diz[date][0]['total_cost'] = (parseFloat(prev_item_total_cost)+parseFloat(new_cost)).toFixed(2);
    }

    if( !('total_cost' in diz[date][1]) ){
        diz[date][1]['total_cost'] = 0;
    }
    if( !(category in diz[date][1]) ){
        diz[date][1][category] = [quantity,new_cost];
        prev_category_total_cost = parseFloat(diz[date][1]['total_cost']).toFixed(2);
        diz[date][1]['total_cost'] = (parseFloat(prev_category_total_cost)+parseFloat(new_cost)).toFixed(2);
    }
    else{
        prev_quantity_value = parseInt(diz[date][1][category][0]);
        prev_item_value = parseFloat(diz[date][1][category][1]).toFixed(2);
        prev_category_total_cost = parseFloat(diz[date][1]['total_cost']).toFixed(2);
        diz[date][1][category][0] = parseInt(prev_quantity_value)+parseInt(quantity);
        diz[date][1][category][1] = (parseFloat(prev_item_value)+parseFloat(new_cost)).toFixed(2);
        diz[date][1]['total_cost'] = (parseFloat(prev_category_total_cost)+parseFloat(new_cost)).toFixed(2);
    }

}


function create_datasets(input){

    for(let i=0; i<input.length; i++){
        str_date = input[i]['date'];
        info_vec = get_info(str_date);
        year = info_vec[0];
        month = info_vec[1];
        day = info_vec[2];
        week = info_vec[3];
        str_year = year.toString();
        str_month = year.toString()+"-"+month.toString();
        str_day = year.toString()+"-"+month.toString()+"-"+day.toString();
        str_week = year.toString()+"-"+month.toString()+"-"+week.toString();

        
        time_diff = get_diff_days(str_date)
        for(let j=0; j<input[i]['items_list'].length; j++){
            item = input[i]['items_list'][j];
            name = item['name'];
            quantity = parseInt(item['quantity']);
            cost_single = parseFloat(item['cost']).toFixed(2);
            category = item['category'];

            cost_total = parseFloat(quantity*cost_single).toFixed(2);

            db_revenue_day[str_day] = (parseFloat(db_revenue_day[str_day])+parseFloat(cost_total)).toFixed(2);
            db_revenue_month[str_month] = (parseFloat(db_revenue_month[str_month])+parseFloat(cost_total)).toFixed(2);
            db_revenue_year[str_year] = (parseFloat(db_revenue_year[str_year])+parseFloat(cost_total)).toFixed(2);
            db_revenue_week[str_week] = (parseFloat(db_revenue_week[str_week])+parseFloat(cost_total)).toFixed(2);


            update_item(db_items_day,str_day,name,quantity,cost_total);         //day
            update_item(db_items_month,str_month,name,quantity,cost_total);     //month
            update_item(db_items_year,str_year,name,quantity,cost_total);       //year
            update_item(db_items_week,str_week,name,quantity,cost_total);       //week

        }
        
    }
    console.log(db_items_day);
    console.log(db_items_month);
    console.log(db_items_year);
    console.log(db_items_week);

}

function add_rows(data,filter,diz){

    tmp = 0;
    base_year = filter_option[0];
    month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    if(filter=="year"){
        for(i in filter_option){
            year = filter_option[i];
            tmp = Math.max(tmp,parseInt(diz[year]));
            data.addRow([year, parseInt(diz[year]) ]);
        }
    }

    else{
        for(date in diz){
            if(date.includes(base_year)){
                x = new Date(date);
                x_month = x.getMonth();
                x_day = x.getDate();
                d = date.substring(5,date.length);
                label = d;
                if(filter=="month") label = month_names[x_month];
                if(filter=="day") label = month_names[x_month]+"-"+x_day;
                if(filter=="week") label = "w"+x_day+"-"+month_names[x_month];
                let row = [label];
                for(i in filter_option){
                    str_date = filter_option[i]+"-"+d;
                    tmp = Math.max(tmp,parseInt(diz[str_date]));
                    row.push(parseInt(diz[str_date]));
                }
                if(row.length==filter_option.length+1){
                    data.addRow(row);
                }
                row = [];
            }
        }
    }


    return tmp;
}

function get_revenue(filter){

    var data = new google.visualization.DataTable();
    data.addColumn({type: 'string', label: 'DATE'});
    let label_text = "";
    if(filter=="week") label_text="weekly revenue";
    if(filter=="day") label_text="daily revenue";
    if(filter=="month") label_text="monthly revenue";
    if(filter=="year") label_text="annual revenue"

    let Values = [];
    let tmp = ['Year'];
    if(filter=='year'){
        data.addColumn({type: 'number', label: label_text});
    }
    else{
        for(x in filter_option){
            tmp.push(filter_option[x].toString());
            data.addColumn({type: 'number', label: label_text+"  "+filter_option[x]});
        }
    }
    
    Values.push(tmp);

    diz = db_revenue_year;
    if(filter=='week') diz = db_revenue_week;
    if(filter=='day') diz = db_revenue_day;
    if(filter=='month') diz = db_revenue_month;
    
    let list_dates = [];
    for( date in diz){
        list_dates.push(date);
    }
    list_dates.sort();

    max = add_rows(data,filter,diz);

    return [data,max];
}

function get_in_between_dates(from_date,to_date){

    start_date = new Date(from_date).getTime();
    end_date = new Date(to_date).getTime();

    if(start_date>end_date){
        tmp = start_date;
        start_date = end_date;
        end_date = tmp;
    }
    else{
    }

    mills_in_a_day = 1000*60*60*24;
    total_day= parseInt(Math.ceil((end_date-start_date)/mills_in_a_day));

    var in_between_dates=[];
    
    current_timestamp = start_date;
    for(let i=0; i<=total_day; i++){
        x = new Date(current_timestamp);
        current_timestamp += mills_in_a_day;
        y = x.getFullYear();
        m = x.getMonth()+1;
        d = x.getDate();
        string_date = y.toString()+"-";
        if(m<10) string_date+="0"+m.toString()+"-";
        else string_date+=m.toString()+"-";
        if(d<10) string_date+="0"+d.toString();
        else string_date+=d.toString();

        in_between_dates.push(string_date);

    }
    return in_between_dates;
}

//category_option
        //0: if we are interested in all the items (wine,pasta,cocacola, ecc..)
        //1: if we are interested in the categories (primo,secondo,contorno,bevanda,ecc...)
//money_option
        //0: if we are interested in finding how many items we sold
        //1: if we are interested in finding how much money we made (for each item)
function get_item_revenue(from_date,to_date,option){
    total_revenue = 0;
    count = 0;
    phrase = "";

    diz = db_items_day;
    if(option=="money") {
        money_option=1;
        phrase = "money earned";
    }
    else {
        money_option=0;
        phrase = "product sold";
    }
    if(chart_category_filter=="category") category_option = 1;
    else category_option = 0;

    
    in_between_dates = get_in_between_dates(from_date,to_date);

    total_revenue = 0;
    dict_category = {};
    dict_items = {};

    for( i in in_between_dates){
        date=in_between_dates[i];
        if(!diz[date]) {
            console.log("date no present  "+date);
            continue;
        }
        count += 1;
        item = diz[date][category_option];
        for (key in item){
            if(key=='total_cost'){
                total_revenue += parseFloat(diz[date][category_option]['total_cost']);
            }
            else{
                if(!dict_category[key]){
                    dict_category[key] = parseFloat(diz[date][category_option][key][money_option]);
                }
                else{
                    dict_category[key] += parseFloat(diz[date][category_option][key][money_option]);
                }
            }
        }
    }

    list_category_pie = [];
    //list_category_combo = [[],[]];
    list_category_combo = [["aaa"],[phrase]];
    list_category_pie.push(["ccc", 'ddd']);

    for(key in dict_category){
        list_category_pie.push([key, parseInt(dict_category[key])]);
        list_category_combo[0].push(key);
        list_category_combo[1].push(parseInt(dict_category[key]));
    }

    if(count==0){
        list_category_pie = [];
        //list_category_combo = [[],[]];
        list_category_combo = [["aaa"],["bbb"]];
        list_category_pie.push(["ccc", 'ddd']);
        list_category_pie.push( ['Data Not Present', 1]);
        list_category_combo[0].push('Data Not Present');
        list_category_combo[1].push(1);
        return [0,list_category_pie,list_category_combo];
    }
    


    return [total_revenue,list_category_pie,list_category_combo];
    
}

function draw(){
    let from = document.getElementById('datapicker_from');
    let to = document.getElementById('datapicker_to');

    from_date = from.value;
    to_date = to.value;

    draw_pie_combo_chart_1(from_date,to_date);
    draw_pie_combo_chart_2(from_date,to_date);
}


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(draw_pie_combo_chart_1);
google.charts.setOnLoadCallback(draw_pie_combo_chart_2);
google.charts.setOnLoadCallback(draw_curve_chart_1);

function draw_pie_combo_chart_1(from_date,to_date) {
    let x = get_item_revenue(from_date,to_date,"money");
    if(chart_type=='pie'){
        var options = {
            title: 'Money',
            //backgroundColor: '#E8E8E8',
            chartArea:{left:"10%",top:"10%",width:"90%",height:"90%"}
        };
        var data = google.visualization.arrayToDataTable(x[1]);
        var chart = new google.visualization.PieChart(document.getElementById('pie_combo_chart_1'));
    }
    if(chart_type=='combo'){
        var options = {
            title: 'Money',
            //backgroundColor: '#E8E8E8',
            seriesType: 'bars',
            vAxis: {minValue: 0},
            chartArea:{left:"10%",top:"10%",width:"60%",height:"80%"}
        };
        var data = google.visualization.arrayToDataTable(x[2]);
        var chart = new google.visualization.ComboChart(document.getElementById('pie_combo_chart_1'));
    }

    chart.draw(data, options);
}

function draw_pie_combo_chart_2(from_date,to_date) { 
    if(from_date==null || from_date==undefined) from_date=document.getElementById('datapicker_from').value;
    if(to_date==null || to_date==undefined) to_date=document.getElementById('datapicker_to').value;
    let x = get_item_revenue(from_date,to_date,"items");

    if(chart_type=='pie'){
        var options = {
            title: 'Products',
            //backgroundColor: '#E8E8E8',
            chartArea:{left:"10%",top:"10%",width:"90%",height:"90%"}
        };
        var data = google.visualization.arrayToDataTable(x[1]);
        var chart = new google.visualization.PieChart(document.getElementById('pie_combo_chart_2'));
    }
    if(chart_type=='combo'){
        var options = {
            title: 'Items',
            //backgroundColor: '#E8E8E8',
            seriesType: 'bars',
            vAxis: {minValue: 0},
            chartArea:{left:"10%",top:"10%",width:"60%",height:"80%"}
        };
        var data = google.visualization.arrayToDataTable(x[2]);
        var chart = new google.visualization.ComboChart(document.getElementById('pie_combo_chart_2'));
    }

    

    chart.draw(data, options);
}

function draw_curve_chart_1(filter) {

    if(filter==undefined) filter="week";
    if(filter==null) filter="week";
    
    let x = get_revenue(filter);
    var data = x[0];
    y_axis_max = parseInt(x[1]*1.1);

    var options = {
        title: 'restaurant revenue',
        curveType: 'function',
        legend: { position: 'bottom' },
        //vAxis: { viewWindowMode:'explicit', viewWindow: { max: y_axis_max, min:-100 } },
        chartArea:{left:"10%",top:"10%", right: "5%",width:"90%"}
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

function changeChartType(type){
    let pie = document.getElementById("pie_filter_button");
    let combo = document.getElementById("combo_filter_button");
    if(type=="pie"){
        pie.style.backgroundColor="#008000";
        combo.style.backgroundColor="#ffffff";
    }
    else{
        pie.style.backgroundColor="#ffffff";
        combo.style.backgroundColor="#008000";
    }

    chart_type=type;
}

function changeChartFilter(type){
    let category = document.getElementById("category_filter_button");
    let items = document.getElementById("items_filter_button");
    if(type=="category"){
        category.style.backgroundColor="#008000";
        items.style.backgroundColor="#ffffff";
    }
    else{
        category.style.backgroundColor="#ffffff";
        items.style.backgroundColor="#008000";
    }
    chart_category_filter=type;
}



function loadMenuPage(restaurantId) {
    const url = `http://staff_menu:8004/staff/${restaurantId}/menu`;
    window.location.href = url;
  }
  
  function loadKitchenPage(restaurantId) {
    const url = `http://kitchen:8001/staff/${restaurantId}/kitchen`;
    window.location.href = url;
  }
  
  function loadChartPage(restaurantId) {
    const url = `http://charts:8002/staff/${restaurantId}/chart`;
    window.location.href = url;
  }
  
  function loadTokenPage(restaurantId) {
    const url = `http://auth:8003/staff/${restaurantId}/token`;
    window.location.href = url;
  }


  function loadLoginPage() {
    const url = `http://auth:8003/staff/login`;
    window.location.href = url;
  }













