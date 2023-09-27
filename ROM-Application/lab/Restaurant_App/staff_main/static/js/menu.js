//change the page
function changeDiv(x,rest_id){
    if(x==0){
        window.location.href = 'http://restaurantmanager:8002/'+rest_id+'/menu/';
    }
    if(x==1){
        window.location.href = 'http://restaurantmanager:8002/'+rest_id+'/staff_page/';
    }
    if(x==2){
        window.location.href = "http://restaurantmanager:8002/"+rest_id+"/chart/"
    }
}

function openPopUp(x){
    let popup_history = document.getElementById('popup_history');
    let popup_current_orders = document.getElementById('popup_current_orders');
    let popup_check_out = document.getElementById('popup_check_out');
    let popup_loading = document.getElementById('popup_loading');
    let popup_error = document.getElementById('popup_error');

    if(x==1){
        popup_history.classList.add("open-popup");
        popup_current_orders.classList.remove("open-popup");
        popup_check_out.classList.remove("open-popup");
        popup_loading.classList.remove("open-popup");
        popup_error.classList.remove("open-popup");
    }
    else if(x==2){
        popup_history.classList.remove("open-popup");
        popup_current_orders.classList.add("open-popup");
        popup_check_out.classList.remove("open-popup");
        popup_loading.classList.remove("open-popup");
        popup_error.classList.remove("open-popup");
    }
    else if(x==3){
        popup_history.classList.remove("open-popup");
        popup_current_orders.classList.remove("open-popup");
        popup_check_out.classList.add("open-popup");
        popup_loading.classList.remove("open-popup");
        popup_error.classList.remove("open-popup");
    }
    else if(x==4){
        popup_history.classList.remove("open-popup");
        popup_current_orders.classList.remove("open-popup");
        popup_check_out.classList.remove("open-popup");
        popup_loading.classList.add("open-popup");
        popup_error.classList.remove("open-popup");
    }
    else if(x==5){
        popup_history.classList.remove("open-popup");
        popup_current_orders.classList.remove("open-popup");
        popup_check_out.classList.remove("open-popup");
        popup_loading.classList.remove("open-popup");
        popup_error.classList.add("open-popup");
    }

    let backgr = document.getElementById("buttons_div");
    backgr.style.pointerEvents="none";
    backgr.style.filter="blur(4px)";
}


function closePopUp(x){
    let popup_history = document.getElementById('popup_history');
    let popup_current_orders = document.getElementById('popup_current_orders');
    let popup_check_out = document.getElementById('popup_check_out');
    let popup_loading = document.getElementById('popup_loading');
    let popup_error = document.getElementById('popup_error');

    if(x==1){
        popup_history.classList.remove("open-popup");
    }
    else if(x==2){
        popup_current_orders.classList.remove("open-popup");
    }
    else if(x==3){
        popup_check_out.classList.remove("open-popup");
    }
    else if(x==4){
        popup_loading.classList.remove("open-popup");
    }
    else if(x==5){
        popup_error.classList.remove("open-popup");
    }

    let backgr = document.getElementById("buttons_div");
    backgr.style.pointerEvents="all";
    backgr.style.filter="blur()";
}

//change the MAKE BUTTON from the normal one to the spinning one
function setMakeOrderButtonSpinning(value){
    makeorder_button = document.getElementById('post_order');
    spinner_button = document.getElementById('post_order_loading');
    if(value == false){
        makeorder_button.style.visibility = "visible";
        spinner_button.style.visibility = "hidden";
        makeorder_button.style.display = "inline";
        spinner_button.style.display = "none";
    }
    if(value == true){
        makeorder_button.style.visibility = "hidden";
        spinner_button.style.visibility = "visible";
        makeorder_button.style.display = "none";
        spinner_button.style.display = "inline";
    }
}
//set the MAKE BUTTON clickability to true or false depending on if there is
//at least one menu item with a quantity >= 1
function setMakeOrderButton(){
    var item_list = document.querySelectorAll('[id=menu_item_input]');
    var table = document.getElementById("token");
    at_least_one_item = false;
    for(var i=0; i<item_list.length; i++){
        if(item_list[i].value != 0){
            at_least_one_item = true;
        }
    }
    //console.log("token value: "+table.value);
    if(table.value==""){
        make_order_button.disabled = "true";
        return;
    }
    make_order_button = document.getElementById('post_order');
    make_order_button.disabled = !at_least_one_item;
}

//reset the MAKE BUTTON
function resetItems(){
    var item_list = document.querySelectorAll('[id=menu_item_input]');
    for(var i=0; i<item_list.length; i++){
        item_list[i].value=0;
    }
    make_order_button = document.getElementById('post_order');
    make_order_button.disabled = "false";
}

//change the value present in the token input 
function onChangeToken(){
    console.log("change token");
    var table_number = document.getElementById('token');
    var item_list = document.querySelectorAll('[name=token]');
    for( var i=0; i<item_list.length; i++){
        item_list[i].value = table_number.value;
    }
    if(table_number.value==""){
        let error = document.getElementById("error_message_div");
        error.style.display="flex";
    }
    else{
        let error = document.getElementById("error_message_div");
        error.style.display="none";
    }
}

function subtract(name){
    var x = parseInt(document.getElementsByName(name)[0].value);
    if(x>0){
        document.getElementsByName(name)[0].value=x-1;
    }
    setMakeOrderButton();
}
function add(name){
    var x = parseInt(document.getElementsByName(name)[0].value);
    document.getElementsByName(name)[0].value=x+1;
    setMakeOrderButton();
}

function getStringItem(name,quantity,cost){
    let s = '<div style="display: flex; height: 1em; padding-left: 40px; padding-right: 30px;">';

    let c = parseFloat(cost).toFixed(2);
    let q = parseFloat(quantity);
    let total = (c*q).toFixed(2);
    
    s += '<div style="width: 7em; text-align: left;">'+name+"</div><p>"+'&nbsp&nbsp&nbspx'+quantity+'&nbsp&nbsp&nbsp'+total.toString()+"$</p></div>";
    return s;
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
    //console.log("date: "+date);
    return date;
}

function free_table(restaurant_id){
    var restaurant_id = restaurant_id;
    var url = "http://restaurantmanager:8003/token_status";
    var token_number = document.getElementById('token').value;
    var msg = {"token":token_number,"restaurant":restaurant_id}
    msg = JSON.stringify(msg)
    //console.log(msg);


    $.ajax({
        type: "GET",
        url: url,
        data: msg,
        contentType: '*/*',
        accepts: '*/*',

        // handle response
        success: function(response) {
            console.log(response);
        },
        
    });

}

function check_token_validity(restaurant_id){
    var restaurant_id = restaurant_id;
    var url = "http://restaurantmanager:8003/validity";
    var token_number = document.getElementById('token').value;
    var msg = {"token":token_number,"restaurant":restaurant_id}
    msg = JSON.stringify(msg)
    //console.log(msg);


    $.ajax({
        type: "GET",
        url: url,
        data: msg,
        contentType: '*/*',
        accepts: '*/*',

        // handle response
        success: function(response) {
            //console.log(response);
            if(response['result']=="yes"){
                makeOrder(restaurant_id,response['table_id']);
            }
            else if(response['result']=="no" || response['result']=="error"){
                //console.log("Token not valid");
                openPopUp(5);
            }
        },
        
    });

}

function makeOrder(rest_id,table_id){
    make_order_button = document.getElementById('post_order');
    make_order_button.disabled = "false";
    setMakeOrderButtonSpinning(true);
    var restaurant_id = rest_id;
    var url = "/"+rest_id;
    var item_list = document.querySelectorAll('[id=menu_item_input]');
    var item_list_cost = document.querySelectorAll('[id=menu_item_input_cost]');
    var item_list_category = document.querySelectorAll('[id=menu_item_input_category]');
    var token_number = document.getElementsByName('token')[0].value;
    var date = get_date();
    

    var list = []
    for(var i = 0; i < item_list.length; i++) {
        if(item_list[i].value != 0){
            var d = {'name':item_list[i].name, 'quantity':item_list[i].value, 'cost':item_list_cost[i].title, 'category':item_list_category[i].title}
            list.push(d);
        }
    }
    var msg = {"restaurant_id":restaurant_id,"token":token_number,"type": "post_order","items_list":list,"date":date,"table_id":table_id}
    //console.log("[makeOrder] msg:");
    msg = JSON.stringify(msg);
    let loading = document.getElementById('loading_gif');
    openPopUp(4);
    
    $.ajax({
        type: "POST",
        url: url,
        data: msg,

        // handle response
        success: function(response) {
            resetItems();
            setMakeOrderButtonSpinning(false);
            loading.src="/static/gif/confirm.gif";
            setTimeout(function() {
                closePopUp(2);
                closePopUp(4);
                loading.src="/static/gif/loading_bottle.gif";
            }, 1500);
        },
        
    });

}

function getPreviousOrders(rest_id){
    var restaurant_id = rest_id;
    var url = "http://restaurantmanager:8000/orders";
    var token_number = document.getElementById('token').value;
    if(token_number==""){
        //console.log("token value: "+token_number);
        //console.log("please insert the number of the table");
        let error = document.getElementById("error_message_div");
        error.style.display = "flex";
        return;
    }
    var msg = {"token":token_number,"type":"get_order","restaurant_id":restaurant_id}
    msg = JSON.stringify(msg)
    //console.log(msg);

    $.ajax({
        type: "GET",
        url: url,
        data: msg,
        contentType: '*/*',
        accepts: '*/*',

        // handle response
        success: function(response) {
            //console.log("response length: "+response.length);
            let s = "";
            for(let i=0; i<response.length; i++){
                //console.log("order_id "+response[i]['order_id']);
                if(i==0){
                    s += '<div style="display: flex; height: 1em; padding-left: 20px; padding-right: 30px; justify-content: space-between;"><p>Order Code N.'+response[i]['order_id'] + "</p><p>" +response[i]['order_status']+"</p></div>";
                }
                else{
                    s += '<div style="display: flex; height: 1em; padding-left: 20px; padding-right: 30px; justify-content: space-between; margin-top: 1em;"><p>order N.'+response[i]['order_id'] + "</p><p>" +response[i]['order_status']+"</p></div>";
                }
                for(let j=0; j<response[i]['items_list'].length; j++){
                    //console.log(response[i]['items_list'][j]['name']+" "+response[i]['items_list'][j]['quantity']+" "+response[i]['items_list'][j]['cost']+" "+response[i]['items_list'][j]['category'])
                    //s += '<div style="display: flex; height: 1em; padding-left: 40px; padding-right: 30px;"><p>'+response[i]['items_list'][j]['name'] + "</p><p>&nbsp&nbsp&nbsp x" +response[i]['items_list'][j]['quantity']+"</p></div>";
                    let tmp = getStringItem(response[i]['items_list'][j]['name'],response[i]['items_list'][j]['quantity'],response[i]['items_list'][j]['cost']);
                    s += tmp;
                }
                //s += "</div>";
            }
            if(response.length==0){
                s += '<div id="no_items_message_div"><div id="no_items_message"><strong>There are no previous orders</strong></div></div>';
            }
            const popup_history_html = document.getElementById('popup_history_list');
            popup_history_html.innerHTML = s;
            openPopUp(1);
        },
        
    });
}

function getCurrentOrders(){
    setMakeOrderButton();
    var token_number = document.getElementById('token').value;
    if(token_number==""){
        //console.log("token value: "+token_number);
        //console.log("please insert the number of the table");
        let error = document.getElementById("error_message_div");
        error.style.display = "flex";
        return;
    }
    var item_list = document.querySelectorAll('[id=menu_item_input]');
    var item_list_cost = document.querySelectorAll('[id=menu_item_input_cost]');
    var list = []
    let s = ""
    let count = 0;
    for(var i = 0; i < item_list.length; i++) {
        if(item_list[i].value != 0){
            count += 1;
            let cost = parseFloat(item_list_cost[i].title);
            let quant = parseFloat(item_list[i].value);
            cost = (cost*quant).toFixed(2);
            //console.log(item_list[i].name+" "+item_list[i].value+" "+item_list_cost[i].title)
            s += '<div style="display: flex; justify-content: space-between;">';
            s += '<div style= "width: 180px;">'+item_list[i].name+'</div>';
            s += '<div style= "width: 100px;">'+item_list[i].value+'</div>';
            s += '<div style= "width: 80px;">'+cost.toString()+'$</div>';
            s += '</div>';
            var d = {'name':item_list[i].name, 'quantity':item_list[i].value, 'cost':item_list_cost[i].title}
            list.push(d);
        }
    }
    if(count==0){
        s += '<div id="no_items_message_div"><div id="no_items_message"><strong>The Order is empty</strong></div></div>';
    }
    const popup_history_html = document.getElementById('popup_current_orders_list');
    popup_history_html.innerHTML = s;
    openPopUp(2);
    
}

function getCheckOut(rest_id){
    var token_number = document.getElementById('token').value;
    if(token_number==""){
        //console.log("token value: "+token_number);
        //console.log("please insert the number of the table");
        let error = document.getElementById("error_message_div");
        error.style.display = "flex";
        return;
    }
    var restaurant_id = rest_id;
    var url = "http://restaurantmanager:8000/orders";
    var token_number = document.getElementsByName('token')[0].value;
    var msg = {"token":token_number,"type":"get_order","restaurant_id":restaurant_id}
    msg = JSON.stringify(msg)
    //console.log(msg);

    $.ajax({
        type: "GET",
        url: url,
        data: msg,
        contentType: '*/*',
        accepts: '*/*',

        // handle response
        success: function(response) {
            //console.log("response length: "+response.length);
            let total = 0;
            for(let i=0; i<response.length; i++){
                //console.log("order_id "+response[i]['order_id']);
                for(let j=0; j<response[i]['items_list'].length; j++){
                    //console.log(response[i]['items_list'][j]['name']+" "+response[i]['items_list'][j]['quantity']+" "+response[i]['items_list'][j]['cost'])
                    let cost = parseFloat(response[i]['items_list'][j]['cost']);
                    let quant = parseFloat(response[i]['items_list'][j]['quantity']);
                    cost = (cost*quant).toFixed(2);
                    total += parseFloat(cost);
                }
            }
            const popup_history_html = document.getElementById('total_cost');
            popup_history_html.innerHTML = "&nbsp;&nbsp;&nbsp;"+total.toFixed(2).toString()+"$";
            openPopUp(3);
        },
        
    });
}

function changeReceipt(x){
    let paper = document.getElementById("paper_button");
    let elettronic = document.getElementById("elettronic_button");
    if(x==1){
        paper.style.opacity=1;
        elettronic.style.opacity=0.3;
    }
    else if(x==2){
        paper.style.opacity=0.3;
        elettronic.style.opacity=1;
    }
}

function changePaymentMethod(x){
    let cash = document.getElementById("cash_button");
    let paypal = document.getElementById("paypal_button");
    let card = document.getElementById("card_button");
    if(x==1){
        cash.style.opacity=1;
        paypal.style.opacity=0.3;
        card.style.opacity=0.3;
    }
    else if(x==2){
        cash.style.opacity=0.3;
        paypal.style.opacity=1;
        card.style.opacity=0.3;
    }
    else if(x==3){
        cash.style.opacity=0.3;
        paypal.style.opacity=0.3;
        card.style.opacity=1;
    }
}



function loadStaffPage() {
    const url = `http://auth:8003/staff/login`;
    window.location.href = url;
  }