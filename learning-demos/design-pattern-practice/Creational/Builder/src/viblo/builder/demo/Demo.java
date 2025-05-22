package viblo.builder.demo;

import viblo.builder.builder.StudentBuilder;
import viblo.builder.concretebuilder.StudentConcreteBuilder;

public class Demo {

	public static void main(String[] args) {

		StudentBuilder studentBuilder = new StudentConcreteBuilder().setFirstName("Tran").setLastName("Quang Huy");

		System.out.println(studentBuilder.build());
	}
}