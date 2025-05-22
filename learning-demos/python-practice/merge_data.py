# %%
# Group Names CSV
import json
import csv
from datetime import datetime

permission_json_file = "elms_permission_json.json"

with open(permission_json_file, "r", encoding="utf-8") as file:
    name_groups = {
        item["nameGroup"] for item in json.load(file)["data"] if "nameGroup" in item
    }

with open(
    f"group_names_{datetime.now():%d%m%Y%H%M%S}.csv", "w", newline="", encoding="utf-8"
) as csvfile:
    csv.writer(csvfile).writerow(["nameGroup"])
    csv.writer(csvfile).writerows([[name] for name in name_groups])

print("Generated successfully")

# %%
# Permissions CSV

import json
import csv
from datetime import datetime

permission_json_file = "elms_permission_json.json"
name_group_json_file = "261024_2.json"

with open(permission_json_file, "r", encoding="utf-8") as file1, open(
    name_group_json_file, "r", encoding="utf-8"
) as file2:
    data1, data2 = json.load(file1)["data"], {
        item["name"]: item["id"] for item in json.load(file2)["data"]["content"]
    }

result = [
    {
        "action": item.get("action", ""),
        "nameGroup": name_group,
        "code": item.get("pcode", ""),
        "groupId": data2.get(name_group, ""),
        "name": item.get("name", ""),
    }
    for item in data1
    if (name_group := item.get("nameGroup")) in data2
]

with open(
    f"permissions_{datetime.now():%d%m%Y%H%M%S}.csv", "w", newline="", encoding="utf-8"
) as csvfile:
    csvwriter = csv.DictWriter(
        csvfile, fieldnames=["action", "nameGroup", "code", "groupId", "name"]
    )
    csvwriter.writeheader()
    csvwriter.writerows(result)

print("Generated successfully")


# %%
# Merge CSV - JSON

import pandas as pd
import json

# Đọc file CSV
csv_data = pd.read_csv("project_role.csv")

# Đọc file JSON
with open("auth_permission.json", "r") as f:
    json_data = json.load(f)

# Chuyển dữ liệu JSON thành DataFrame và lọc các trường cần thiết
json_df = pd.json_normalize(json_data["data"])
json_df = json_df[["id", "name", "action", "pcode", "permissionGroup.id"]]
json_df.rename(
    columns={"pcode": "p_code", "permissionGroup.id": "permissionGroupId"}, inplace=True
)

# Join hai dữ liệu trên trường 'p_code'
merged_data = pd.merge(csv_data, json_df, on="p_code", how="inner")


merged_data[["id_y", "action_x", "p_code", "permissionGroupId", "name"]].to_csv(
    "output_291024.csv", index=False
)
