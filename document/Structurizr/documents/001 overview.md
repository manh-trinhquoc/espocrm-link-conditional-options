## Overview

- Xây dựng trường linkConditionalOptions có dạng giống trường link mặc định của Espo.
- Kết quả record trả về sẽ được lọc dựa theo giá trị của 1 hoặc nhiều trường khác.
- điều kiện so sánh có thể là bằng, khác, lớn, nhỏ, chứa, không chứa...

## Mô tả người dùng tương tác

- Người dùng admin tạo field linkConditionalOptions và set các điều kiện lọc theo các trường khác.
- Admin sẽ phải chọn các cấu hình

| option | description
| --- | ---
| attribute | tên trường lọc trong record hiện tại để lấy giá trị lọc
| externalAttribute | tên trường trong entity link tới
| type | điều kiện so sánh

- người dùng có thể chọn nhiều trường làm điều kiện lọc. Giao diện bắt trước conditional options của trường enum


## Tham khảo
- Dynamic handler: các option trong dynamic logic https://docs.espocrm.com/development/dynamic-handler/
- nếu không đủ khả năng tạo dynamic handler, dùng tạm params trong metatada/fields https://docs.espocrm.com/development/metadata/fields/
- coding rule: https://docs.espocrm.com/development/coding-rules/#11-use-dto-rather-than-associative-arrays-or-stdclass-objects
