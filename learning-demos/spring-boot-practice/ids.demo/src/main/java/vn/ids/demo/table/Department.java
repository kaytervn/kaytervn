package vn.ids.demo.table;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "departments")
@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "table_generator")
    @TableGenerator(
            name = "table_generator",
            table = "dep_ids",
            pkColumnName = "gen_id",
            valueColumnName = "gen_value",
            allocationSize = 1
    )
    long id;

    String name;

    public Department(String name) {
        this.name = name;
    }
}