from flask import Flask
from flask_restful import Api
import requests
from flask_cors import CORS
import random
import json

app=Flask(__name__)
api=Api(app)
CORS(app)

url_orders = "http://orders:8000/orders"

def generate_date():
    day = random.randint(1,30)
    month = random.randint(1,12)
    
    while(day>28 and month==2):
        day = random.randint(1,30)
        month = random.randint(1,12)
    
    year = random.randint(2021, 2023)
    if day<10:
        day = "0"+str(day)
    if month<10:
        month = "0"+str(month)
    
    date = str(year)+"-"+str(month)+"-"+str(day)
    return date

def generate_item_sushi(do_not_consider):
    #print(do_not_consider)
    list_name = ['cocacola','cocacola_zero','fanta','sparkling water','sprite','water',
                 'heineken','ichnusa',
                 'fried_chicken','onion_ring','rolls','tempura',
                 'grilled_meat_ravioli','steamed meat ravioli','steamed shrimp ravioli',
                 'mixed_sashimi','salmon_sushi','tuna_sashimi',
                 'rice with vegetables','soy noodles',
                 'salmon_nigiri','tuna_nigiri']
    list_cost = [2.50, 2.50, 2.50, 1.50, 2.50, 1.50,
                 3.50, 3.50,
                 2, 3, 1.80, 1.80,
                 3.50, 3.50, 3.50,
                 6, 4, 4,
                 5, 5,
                 3, 3]
    list_category = ['soft drinks','soft drinks','soft drinks','soft drinks','soft drinks','soft drinks',
                     'beers','beers',
                     'fried','fried','fried','fried',
                     'appetizers','appetizers','appetizers',
                     'sashimi and tartare','sashimi and tartare','sashimi and tartare',
                     'first dishes','first dishes',
                     'nigiri','nigiri']
    
    candidate_item = []
    candidate_cost = []
    candidate_category = [] 
    for x in range(len(list_name)):
        item = list_name[x]
        if item not in do_not_consider:
            candidate_item.append(list_name[x])
            candidate_cost.append(list_cost[x])
            candidate_category.append(list_category[x])
        
    
    #lf picks a random item and retrieves its values    
    x = random.randint(0,len(candidate_item)-1)
    name = candidate_item[x]
    quantity = random.randint(1,6)
    cost = candidate_cost[x]
    category = candidate_category[x]
    
    item_diz = {}
    item_diz['name']=name
    item_diz['quantity']=quantity
    item_diz['cost']=cost
    item_diz['category']=category
    
    return item_diz

def generate_item_pizza(do_not_consider):
    #print(do_not_consider)
    list_name = ['arancine','ascolis olives','croquettes','fries','suppli',
                 'boscaiola','calzone','capricciosa','margherita','marinara','pepperoni','cheese pizza',
                 'choccolate ice cream',
                 'cocacola','cocacola_zero','fanta','sparkling water','sprite','water',
                 'heineken','ichnusa']
    list_cost = [6 , 2.50 , 3.50 , 4 , 3.50 ,
                 10, 9.50, 8.50, 7, 9.60, 10, 11,
                 5,
                 2.50, 2.50, 2.50, 1.50, 2.50, 1.50,
                 3.50, 3.50]
    list_category = ['appetizers','appetizers','appetizers','appetizers','appetizers',
                     'first dishes','first dishes','first dishes','first dishes','first dishes','first dishes','first dishes',
                     'desserts',
                     'soft drinks','soft drinks','soft drinks','soft drinks','soft drinks','soft drinks',
                     'beers','beers']
    
    candidate_item = []
    candidate_cost = []
    candidate_category = [] 
    for x in range(len(list_name)):
        item = list_name[x]
        if item not in do_not_consider:
            candidate_item.append(list_name[x])
            candidate_cost.append(list_cost[x])
            candidate_category.append(list_category[x])
        
    
    #lf picks a random item and retrieves its values    
    x = random.randint(0,len(candidate_item)-1)
    name = candidate_item[x]
    quantity = random.randint(1,6)
    cost = candidate_cost[x]
    category = candidate_category[x]
    
    item_diz = {}
    item_diz['name']=name
    item_diz['quantity']=quantity
    item_diz['cost']=cost
    item_diz['category']=category
    
    return item_diz


def generate_items_list(num_items, restaurant_type):
    
    items_list = []
    do_not_consider = []
    if(restaurant_type == "pizza hut"):
        for i in range(num_items):
            item = generate_item_pizza(do_not_consider)
            items_list.append(item)
            do_not_consider.append(item['name'])
    elif(restaurant_type == "sushi"):
        for i in range(num_items):
            item = generate_item_sushi(do_not_consider)
            items_list.append(item)
            do_not_consider.append(item['name'])
        
    
    return items_list


def generate_order(order_id, restaurant_type):
    
    order_diz = {}
    order_diz['restaurant_id']=restaurant_type
    order_diz['order_status']='waiting'
    order_diz['date']=generate_date()
    order_diz['order_id']=order_id
    order_diz['token']='table_5'
    order_diz['table_id']='table_5'
    order_diz['items_list']= generate_items_list(random.randint(1,9), restaurant_type)
    
    return order_diz
    #return json.dumps(order_diz,indent=4)
    

# for i in range(0):
#     if(i < 400):
#         order = generate_order(i, "sushi")
#         print("order N."+str(i))
#         print(order)
#         response = requests.post(url_orders, json=order)
#     else:
#         order = generate_order(i, "pizza hut")
#         print("order N."+str(i))
#         requests.post(url_orders,json=order)

    
    


    

