package vn.ids.demo.custom;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "products")
@Entity
public class Product {

    @Id
    @GeneratedValue(generator = "prod-generator")
    @GenericGenerator(
            name = "prod-generator",
            strategy = "vn.ids.demo.custom.MyGenerator",
            parameters = @Parameter(name = "prefix", value = "prod")
    )
    private String id;
    private String name;

    public Product(String name) {
        this.name = name;
    }
}