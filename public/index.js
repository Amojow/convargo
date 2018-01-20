'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];

var i;
var j;
var a;
var b;

for(i=0;i<deliveries.length;i++)//go through the deliveries list
{
  //STEP 1
  for(j=0;j<truckers.length;j++)//go through the trucker 
  {
    if(truckers[j]['id'] == deliveries[i]['truckerId'])
    {
      deliveries[i]['price'] = truckers[j]['pricePerKm'] *  deliveries[i]['distance'] + truckers[j]['pricePerVolume'] * deliveries[i]['volume'];
    }
  }

  //STEP 2
  if(deliveries[i]['distance'] > 5 && deliveries[i]['volume'] < 10)
  {
    deliveries[i]['price'] = deliveries[i]['price'] * 0.9;
  }
  if(deliveries[i]['distance'] > 10 && deliveries[i]['volume'] < 25)
  {
    deliveries[i]['price'] = deliveries[i]['price'] * 0.7;
  }
  if(deliveries[i]['volume'] > 25)
  {
    deliveries[i]['price'] = deliveries[i]['price'] * 0.5;
  }


  //STEP 3
  var commission = deliveries[i]['price'] * 0.3;
  deliveries[i]['commission']['insurance'] = commission / 2;
  deliveries[i]['commission']['treasury'] = parseInt(deliveries[i]['distance'] / 500)+1 ;
  deliveries[i]['commission']['convargo']= commission -(deliveries[i]['commission']['treasury'] + deliveries[i]['commission']['insurance']);
  
  
  //STEP 4
  if(deliveries[i]['options']['deductibleReduction'])
  {
    deliveries[i]['commission']['convargo'] = deliveries[i]['commission']['convargo'] + deliveries[i]['volume']*1;
  }


  //STEP 5
  for(a=0; a<actors.length;a++)//fill actors payment
  {
    if(actors[a]['deliveryId'] == deliveries[i]['id'])
    {
      for(b=0; b<actors[a]['payment'].length;b++)//browse the list payment
      {
      
        if(actors[a]['payment'][b]['who'] == 'trucker')
        {
          actors[a]['payment'][b]['amount'] = deliveries[i]['price'] *0.7;
        }
        if(actors[a]['payment'][b]['who'] == 'shipper')
        {
          if(deliveries[i]['options']['deductibleReduction'])
          {
            actors[a]['payment'][b]['amount'] = deliveries[i]['price']+deliveries[i]['volume'];
          }
          else
          {
            actors[a]['payment'][b]['amount'] = deliveries[i]['price'];
          }

        }
        if(actors[a]['payment'][b]['who'] == 'insurance')
        {
          actors[a]['payment'][b]['amount'] = deliveries[i]['commission']['insurance'];
        }
        if(actors[a]['payment'][b]['who'] == 'treasury')
        {
          actors[a]['payment'][b]['amount'] = deliveries[i]['commission']['treasury'];
        }
        if(actors[a]['payment'][b]['who'] == 'convargo')
        {
          actors[a]['payment'][b]['amount'] = deliveries[i]['commission']['convargo'];
        }
      }
    }
  }
}

console.log(truckers);
console.log(deliveries);
console.log(actors);
