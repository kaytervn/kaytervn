package viblo.builder.builder;

import viblo.builder.product.Student;

// Builder 
public interface StudentBuilder {

	StudentBuilder setId(String id);

	StudentBuilder setFirstName(String firstName);

	StudentBuilder setLastName(String lastName);

	StudentBuilder setDayOfBirth(String dayOfBirth);

	StudentBuilder setCurrentClass(String currentClass);

	StudentBuilder setPhone(String phone);

	Student build();
}