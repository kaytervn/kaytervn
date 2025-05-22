<h1 align="center">RESTful Web Services with Spring Boot</h1>

<h2>Spring Boot Architecture</h2>

| Layer                             | Component                                                                            | Purpose                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **1.** Presentation (`Web`)       | Controllers (@RestController), HTML pages (JSP), JSON or XML responses.              | Handles HTTP requests, processes input, and returns responses.                                                 |
| **2.** Business Logic (`Service`) | Services (@Service), business logic classes.                                         | Contains business logic and rules, processes data from the persistence layer and interacts with the web layer. |
| **3.** Persistence (`Repository`) | Repositories (@Repository), Data Access Objects (DAO), Spring Data JPA repositories. | Manages data access and persistence.                                                                           |
| **4.** Model (`Domain`)           | Entity classes (@Entity), POJOs (Plain Old Java Objects).                            | Represents the data structures or entities.                                                                    |

<h2>Spring Initializing</h2>

**1.** Go to the site: https://start.spring.io/

**2.** Select features.

| Feature     | Selection  |
| ----------- | ---------- |
| Project     | `Maven`    |
| Language    | `Java`     |
| Spring Boot | `3.3.1`    |
| Packaging   | `JAR`      |
| Java        | `22`, `17` |

**3.** Set **Group** ID, **Artifact** ID, and Project Name.

**4.** Select dependencies.

| Dependency          | Tag               |
| ------------------- | ----------------- |
| Spring Web          | `WEB`             |
| Validation          | `I/O`             |
| Java Mail Sender    | `I/O`             |
| Spring Data JPA     | `SQL`             |
| PostgreSQL Driver   | `SQL`             |
| Liquibase Migration | `SQL`             |
| Lombok              | `DEVELOPER TOOLS` |

| **Optional**                   | **Tag**           |
| ------------------------------ | ----------------- |
| Spring HATEOAS                 | `WEB`             |
| Rest Repositories HAL Explorer | `WEB`             |
| H2 Database                    | `SQL`             |
| MySQL Driver                   | `SQL`             |
| Spring Boot Actuator           | `OPS`             |
| OAuth2 Resource Server         | `SECURITY`        |
| Spring Security                | `SECURITY`        |
| Spring for Apache ActiveMQ 5   | `MESSAGING`       |
| Spring Boot DevTools           | `DEVELOPER TOOLS` |

**5.** Click `Generate` (automatically download a zip file).

**6.** Unzip the `.ZIP` file.

**7.** Import that project folder from **Eclipse** (`Import` -> `Existing Maven Projects`).

**8.** Wait for **dependencies** download (`it really takes time for the first time using a specific version of Spring Boot or maybe my Internet capability sucks :D`).

<h2 align="center">Configuration Notes</h2>

### pom.xml configuration

**Properties:**

```xml
<properties>
	<java.version>22</java.version>
	<projectlombok-lombok.version>1.18.32</projectlombok-lombok.version>
	<mapstruct.version>1.5.5.Final</mapstruct.version>
	<lombok-mapstruct-binding.version>0.2.0</lombok-mapstruct-binding.version>
	<springdoc-version>2.5.0</springdoc-version>
	<jsonwebtoken-version>0.12.5</jsonwebtoken-version>
	<slf4j-version>2.0.13</slf4j-version>
</properties>
```

**Dependencies:**

```xml
<dependency>
	<groupId>org.springdoc</groupId>
	<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
	<version>${springdoc-version}</version>
</dependency>
<dependency>
	<groupId>org.mapstruct</groupId>
	<artifactId>mapstruct</artifactId>
	<version>${mapstruct.version}</version>
</dependency>
<dependency>
	<groupId>org.springframework.security</groupId>
	<artifactId>spring-security-crypto</artifactId>
</dependency>
<dependency>
	<groupId>io.jsonwebtoken</groupId>
	<artifactId>jjwt</artifactId>
	<version>${jsonwebtoken-version}</version>
</dependency>
<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-api</artifactId>
	<version>${slf4j-version}</version>
</dependency>
```

**Plugin:**

```xml
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-compiler-plugin</artifactId>
	<version>${maven-compiler-plugin.version}</version>
	<configuration>
		<source>${java.version}</source>
		<target>${java.version}</target>
		<annotationProcessorPaths>
			<path>
				<groupId>org.projectlombok</groupId>
				<artifactId>lombok</artifactId>
				<version>${projectlombok-lombok.version}</version>
			</path>
			<path>
				<groupId>org.projectlombok</groupId>
				<artifactId>lombok-mapstruct-binding</artifactId>
				<version>${lombok-mapstruct-binding.version}</version>
			</path>
			<path>
				<groupId>org.mapstruct</groupId>
				<artifactId>mapstruct-processor</artifactId>
				<version>${mapstruct.version}</version>
			</path>
		</annotationProcessorPaths>
		<compilerArgs>
			<arg>-Amapstruct.suppressGeneratorTimestamp=true</arg>
			<arg>-Amapstruct.defaultComponentModel=spring</arg>
			<arg>-Amapstruct.verbose=true</arg>
		</compilerArgs>
	</configuration>
</plugin>
```

### Social Media Application

Local host: http://localhost:8080/

User -> Posts (one to many)

### User Endpoints

| Action             | Endpoints                      |
| ------------------ | ------------------------------ |
| Retrieve all Users | GET /users                     |
| Create a User      | POST /users                    |
| Retrieve one User  | GET /users/{id} -> /users/1    |
| Delete a User      | DELETE /users/{id} -> /users/1 |

### Posts Endpoints

| Action                        | Endpoints                       |
| ----------------------------- | ------------------------------- |
| Retrieve all posts for a User | GET /users/{id}/posts           |
| Create a posts for a User     | POST /users/{id}/posts          |
| Retrieve details of a post    | GET /users/{id}/posts/{post_id} |

<h2>Internationalization</h2>

| Configuration                                                                            | Usage                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AcceptHeaderLocaleResolver<br>setDefaultLocale(Locale.US)<br>ResourceBundleMessageSource | @Autowired MessageSource<br>@RequestHeader(value = "Accept-Language", required = false)<br>Locale locale messageSource.getMessage("helloWorld.message", null, locale) |

<h2>Input Data Validation</h2>

| Annotation  | Description                                                |
| ----------- | ---------------------------------------------------------- |
| `@NotNull`  | Field must not be null.                                    |
| `@NotEmpty` | Collection must not be empty.                              |
| `@NotBlank` | String must not be blank (**neither be null nor empty**).  |
| `@Min`      | Value must be greater than or equal to a specified min.    |
| `@Max`      | Value must be less than or equal to a specified max.       |
| `@Pattern`  | String must match a regular expression (**customizable**). |
| `@Email`    | String must be a valid email address.                      |

<h3>Simple validation</h3>

```java
@Pattern(regexp = "^\\d{10}$", message = "phone is invalid")
private String phone;

@NotNull(message = "dateOfBirth must not be null")
@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
@JsonFormat(pattern = "MM/dd/yyyy")
@Past(message = "dateOfBirth must be a past date")
private Date dateOfBirth;

@NotEmpty(message = "permissions must not be empty")
List<String> permissions;
```

<details>
  <summary>Advanced validation</summary>

**1.** Create anotation class:

```java
// Anotation Phone Number
@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface PhoneNumber {
	String message() default "Invalid phone number";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
```

**2.** Create validator class (customize regexp):

```java
// Regular Expression Validator
public class PhoneValidator implements ConstraintValidator<PhoneNumber, String> {

	@Override
	public boolean isValid(String phoneNo, ConstraintValidatorContext cxt) {
		if (phoneNo == null) {
			return false;
		}
		// validate phone numbers of format "0902345345"
		if (phoneNo.matches("\\d{10}"))
			return true;
		// validating phone number with -, . or spaces: 090-234-4567
		else if (phoneNo.matches("\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}"))
			return true;
		// validating phone number with extension length from 3 to 5
		else // return false if nothing matches the input
		if (phoneNo.matches("\\d{3}-\\d{3}-\\d{4}\\s(x|(ext))\\d{3,5}"))
			return true;
		// validating phone number where area code is in braces ()
		else
			return phoneNo.matches("\\(\\d{3}\\)-\\d{3}-\\d{4}");
	}

}
```

**3.** Config field:

```java
@PhoneNumber // Created Anotation
String phone;
```

</details>

<h2>Enum Validation</h2>

<details>
  <summary>Method 1: Regular Expression (Regexp)</summary>

**1.** Create enum class:

```java
public enum UserStatus {
    @JsonProperty("active")
    ACTIVE,
    @JsonProperty("inactive")
    INACTIVE,
    @JsonProperty("none")
    NONE
}
```

**2.** Create anotation class:

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR,
		ElementType.PARAMETER, ElementType.TYPE_USE })
@Constraint(validatedBy = EnumPatternValidator.class)
public @interface EnumPattern {
	String name();

	String regexp();

	String message() default "{name} must match {regexp}";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
```

**3.** Create validator class:

```java
public class EnumPatternValidator implements ConstraintValidator<EnumPattern, Enum<?>> {
	private Pattern pattern;

	@Override
	public void initialize(EnumPattern enumPattern) {
		try {
			pattern = Pattern.compile(enumPattern.regexp());
		} catch (PatternSyntaxException e) {
			throw new IllegalArgumentException("Given regex is invalid", e);
		}
	}

	@Override
	public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
		if (value == null) {
			return true;
		}

		Matcher matcher = pattern.matcher(value.name());
		return matcher.matches();
	}
}
```

**4.** Config field:

```java
@EnumPattern(name = "status", regexp = "ACTIVE|INACTIVE|NONE")
UserStatus status;
```

_It allows applying to other enums:_

```java
@EnumPattern(name = "gender", regexp = "MALE|FEMALE|OTHER")
private Gender status;
```

</details>

<details>
  <summary>Method 2: String Value (Recommended)</summary>
  
**1.** Create enum class:

```java
public enum UserType {
	OWNER, ADMIN, USER
}
```

**2.** Create anotation class:

```java
@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR,
		ElementType.PARAMETER, ElementType.TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = { EnumValueValidator.class })
public @interface EnumValue {
	String name();

	String message() default "{name} must be any of enum {enumClass}";

	Class<? extends Enum<?>> enumClass();

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
```

**3.** Create validator class:

```java
public class EnumValueValidator implements ConstraintValidator<EnumValue, CharSequence> {
	private List<String> acceptedValues;

	@Override
	public void initialize(EnumValue enumValue) {
		acceptedValues = Stream.of(enumValue.enumClass().getEnumConstants()).map(Enum::name).toList();
	}

	@Override
	public boolean isValid(CharSequence value, ConstraintValidatorContext context) {
		if (value == null) {
			return true;
		}

		return acceptedValues.contains(value.toString().toUpperCase());
	}
}
```

**4.** Config field:

```java
@NotNull(message = "type must not be null")
@EnumValue(name = "type", enumClass = UserType.class)
private String type;
```

_It allows applying to other enums and handling exception_

**--> Best recommended method**

</details>

<details>
  <summary>Method 3: Specifying Values</summary>
  
**1.** Create enum class:

```java
public enum Gender {
	@JsonProperty("male")
	MALE, @JsonProperty("female")
	FEMALE, @JsonProperty("other")
	OTHER;
}
```

**2.** Create anotation class:

```java
@Documented
@Target({ ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = GenderSubSetValidator.class)
public @interface GenderSubset {
	Gender[] anyOf();

	String message() default "must be any of {anyOf}";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
```

**3.** Create validator class:

```java
public class GenderSubSetValidator implements ConstraintValidator<GenderSubset, Gender> {
	private Gender[] genders;

	@Override
	public void initialize(GenderSubset constraint) {
		this.genders = constraint.anyOf();
	}

	@Override
	public boolean isValid(Gender value, ConstraintValidatorContext context) {
		return value == null || Arrays.asList(genders).contains(value);
	}
}
```

**4.** Config field:

```java
@GenderSubset(anyOf = { Gender.MALE, Gender.FEMALE, Gender.OTHER })
private Gender gender;
```

_It allows specifying **particular values** to validate within the enum instead of all:_

```java
@GenderSubset(anyOf = {Gender.MALE, Gender.FEMALE})
private Gender gender;
```

</details>

<h2 align="center">Notes</h2>

### Eclipse IDE

- **Run server:** run file `{ProjectName}Application.java` as **Java Application**.

- Restart server after adding new dependencies: On **Console** bar, `Terminate` -> `Remove All Terminated Launches`, then `Run` again.

---

### Eclipse: Maven error "Failure to transfer..."

#### Remove all failed downloads:

**1.** Run `cmd`.

**2.** `cd C:\Users\kiend\.m2\repository`.

**3.** `for /r %i in (*.lastUpdated) do del %i`.

**4.** Right click on the project in Eclipse -> `Maven` -> `Update Project...`

---

### Eclipse: Auto-complete Setting

`Windows` -> `Preferences` -> `Java` -> `Editor` -> `Content Assist`.

Auto activation triggers for Java: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ._`

**--> Apply and Close**

---

### IntelliJ IDE: Encoding UTF-8

`Settings` -> `Editor` -> `Files Encoding`.

| Global Encoding                           | UTF-8     |
| :---------------------------------------- | --------- |
| **Project Encoding**                      | **UTF-8** |
| **Default encoding for properties files** | **UTF-8** |

--> Tick `Transparent native-to-ascii conversion`, then `Apply`.

---

### Postman: Storing and using environment variables

`Environments` -> `Create new environment` -> Set variables -> Back to `Collections`, then choose your created environment set.

**Scripts:** _(On logging in request)_

```js
if (pm.response.json().data != null) {
  pm.environment.set("bearerToken", pm.response.json().data.token);
  pm.environment.set("userId", pm.response.json().data.userId);
}
```

---

### Response Status

- **GET**: `200 OK`
- **POST**: `201 CREATED`
- **DELETE**: `204 NO_CONTENT`
- **PUT**, **PATCH**: `202 ACCEPTED`

| Code  | Status                |
| :---: | --------------------- |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `403` | Forbidden             |
| `404` | Not Found             |
| `500` | Internal Server Error |

---

### Versioning

- Media type versioning (a.k.a `content negotiation` or `accept header`): **GitHub**
- (Custom) headers versioning: **Microsoft**
- URI Versioning: **Twitter**
- Parameter versioning: **Amazon**

| Factors                                    |
| ------------------------------------------ |
| URI Pollution                              |
| Misuse of HTTP Headers                     |
| Caching                                    |
| Can we execute the request on the browser? |
| API Documentation                          |

**--> No Perfect Solution**

---

- **Add dependency:** Remove the version tag -> Maven will use the version defined of the parent POM (`Spring framework` packages only).

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.1-SNAPSHOT</version>
    <relativePath /> <!-- lookup parent from repository -->
</parent>
```

- **XML** Content Supporting (Optional):

```xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

**Postman:** On **Header** section:

| Key    | Value           |
| ------ | --------------- |
| Accept | application/xml |

- Auto generation of Swagger documentation:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

## Others

**MySQL Dump:**

```cmd
cd C:\Program Files\MySQL\MySQL Server 8.0\bin
```

```cmd
mysqldump -u root -p db_name > D:\Downloads\dump_file.sql
```

**MySQL Change Root Password:**

```cmd
cd C:\Program Files\MySQL\MySQL Server 8.0\bin
```

```cmd
mysqladmin -u root -p password new_password
```

**Liquibase Changelog Export Data:**

```
mvn liquibase:generateChangeLog -Dliquibase.diffTypes=data
```
