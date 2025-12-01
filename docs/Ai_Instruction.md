## Hướng dẫn

### Tên miền được deploy lên là: https://smart-wine-store-ai.onrender.com

Các api:

- POST "/chatbot/chat":
  Request body có dạng

  ```bash
  {
      "user_id": string,
      "message": string
  }

  Example

  {
      "user_id": "1",
      "message": "Xin chào, cho tôi một số loại rượu ngon"
  }
  ```

  Response có dạng

  ```bash
  {
      "user_id": string,
      "response": string
  }

  Example

  {
      "user_id": "1",
      "response": "À, để mà nói về rượu ngon thì nhiều lắm! Nhưng nếu để giới thiệu vài chai đỉnh cao thì phải kể đến:\n\n*   **Château Angelus 2009** từ Pháp, chai này thì khỏi phải bàn về độ xuất sắc, có dấu ấn riêng biệt lắm.\n*   Hoặc thử **Luce Brunello Di Montalcino 2017** của Ý, dòng này đẳng cấp, hương vị phức hợp, được giới mộ điệu săn đón đấy.\n*   Nếu thích sự tinh tế, thanh lịch thì **Louis Latour Vosne-Romanée 2015** cũng là một lựa chọn cực ổn, hương thơm đặc biệt và hấp dẫn."
  }
  ```

- POST "/recommended-products"
  Request body được lấy khi người dùng bấm đặt hàng sản phẩm
  Example
  ```bash
  {
      "statusCode": 201,
      "message": "Success",
      "data": {
          "OrderID": 3,
          "UserID": 1,
          "UserName": "John Doe",
          "Email": "john@example.com",
          "PhoneNumber": "+84123456789",
          "OrderStreetAddress": "123 Main St",
          "OrderWard": "Ward 1",
          "OrderProvince": "Hanoi",
          "CreatedAt": "2025-11-26T03:56:22.310Z",
          "Subtotal": 610,
          "DiscountTierID": 2,
          "DiscountTierValue": 7,
          "DiscountID": 1,
          "DiscountValue": 10,
          "FinalTotal": 506.3,
          "StatusID": 1,
          "Details": [
          {
              "DetailID": 4,
              "OrderID": 3,
              "ProductID": 43,
              "ProductName": "Red Wine Classic 1",
              "Quantity": 2,
              "UnitPrice": 150,
              "DiscountValue": 10,
              "FinalItemPrice": 270
          },
          {
              "DetailID": 5,
              "OrderID": 3,
              "ProductID": 16,
              "ProductName": "White Wine Premium",
              "Quantity": 2,
              "UnitPrice": 170,
              "DiscountValue": 0,
              "FinalItemPrice": 340
          },
          {
              "DetailID": 4,
              "OrderID": 6,
              "ProductID": 12,
              "ProductName": "Rose Wine Premium",
              "Quantity": 2,
              "UnitPrice": 170,
              "DiscountValue": 0,
              "FinalItemPrice": 340
          }
          ]
      }
  }
  ```
  Thực hiện tìm 5 sản phẩm tương đồng nhất với các sản phầm mà người dùng đã đặt
  Example
  ```bash
  [
      {
          "product_id": 17,
          "similarity_score": 0.9983827948363161
      },
      {
          "product_id": 58,
          "similarity_score": 0.9717076504930632
      },
      {
          "product_id": 56,
          "similarity_score": 0.968714479739829
      },
      {
          "product_id": 1503,
          "similarity_score": 0.950537601059249
      },
      {
          "product_id": 914,
          "similarity_score": 0.9469096708122187
      }
  ]
  ```
