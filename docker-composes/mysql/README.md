**Download timezone data:**

```bash
docker exec -it mysql bash
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p 123456@a
```
