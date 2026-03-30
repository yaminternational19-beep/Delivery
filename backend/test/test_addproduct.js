import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';



const API_URL = 'http://localhost:9000/api/v1/products';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6IlNVUEVSX0FETUlOIiwidHlwZSI6IlJFRlJFU0hfVE9LRU4iLCJpYXQiOjE3NzQ2ODA0MzgsImV4cCI6MTc3NTI4NTIzOH0.4Lv65NFivU04P98XmOsaN3RrNPiGORaphohvOSKd3-M';

async function testAddProduct() {
  try {
    const form = new FormData();

    // Basic Info
    form.append('vendor_id', '1');
    form.append('category_id', '1');
    form.append('subcategory_id', '1');
    form.append('brand_id', '1');
    form.append('name', 'Puma RS-X Casual Sneakers');
    form.append('description', 'Modern chunky sneakers with premium cushioning and breathable mesh.');
    
    // JSON Strings for complex objects
    form.append('specification', JSON.stringify({
      "Material": "Mesh & Leather",
      "Sole": "Rubber",
      "Close": "Lace-up",
      "Style": "Chunky"
    }));

    form.append('country_of_origin', 'Vietnam');
    form.append('return_allowed', 'true');
    form.append('return_days', '7');

    // Variants JSON String
    const variants = [
      {
        variant_name: "Blue/White-UK8",
        unit: "Pair",
        color: "Blue",
        sku: "PUMA-RSX-BW-8",
        mrp: 8999,
        sale_price: 6499,
        stock: 25,
        min_order: 1,
        low_stock_alert: 5
      },
      {
        variant_name: "Blue/White-UK9",
        unit: "Pair",
        color: "Blue",
        sku: "PUMA-RSX-BW-9",
        mrp: 8999,
        sale_price: 6499,
        stock: 15,
        min_order: 1,
        low_stock_alert: 5
      }
    ];
    form.append('variants', JSON.stringify(variants));

    // Dummy Image Buffer (to simulate file upload)
    const dummyImage = Buffer.from('dummy-image-content');
    form.append('images', dummyImage, {
      filename: 'sneaker_main.jpg',
      contentType: 'image/jpeg',
    });

    console.log('--- Sending Request to Create Product ---');
    
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    console.log('SUCCESS Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('ERROR Response:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

testAddProduct();
