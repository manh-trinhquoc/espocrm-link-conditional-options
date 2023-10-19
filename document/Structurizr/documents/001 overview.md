## Overview

- Kết quả record của trường link trả về sẽ được lọc dựa theo giá trị của 1 hoặc nhiều trường khác.

TODO: v0.0.2
- Xây dựng trường linkConditionalOptions riêng biệt, sử dụng trường này thay thế trường link cần áp dụng điều kiện lọc
- Điều kiện lọc có thể được cấu hình qua admin giống như condition Option của trường enum


## Triển khai
- người dùng cấu hình sử dụng custom view cho field type loại link ` entityDefs/ENTITY.json `. Trong custom view sẽ can thiệp vào hàm sinh ra url query dữ liệu ở backend.
```json 

    "fields": {
        "FIELD": {
            "type": "link",
            "view": "link-condition-options:views/fields/link-condition-options"
        }
    },

```
- người dùng override hàm ` getModelFilterObjects ` để áp dụng logic thực tế cần thiết

TODO: v0.0.2
- Người dùng admin tạo field linkConditionalOptions và set các điều kiện lọc theo các trường khác.
- Admin sẽ phải chọn các cấu hình

| option | description
| --- | ---
| originalLinkField | Trường link gốc mà trường này sẽ thay thế



- người dùng có thể chọn nhiều trường làm điều kiện lọc. Giao diện bắt trước conditional options của trường enum

## Tham khảo
- Dynamic handler: các option trong dynamic logic https://docs.espocrm.com/development/dynamic-handler/
- nếu không đủ khả năng tạo dynamic handler, dùng tạm params trong metatada/fields https://docs.espocrm.com/development/metadata/fields/
- coding rule: https://docs.espocrm.com/development/coding-rules/#11-use-dto-rather-than-associative-arrays-or-stdclass-objects
