const javaDatatypes = [
  "String",
  "Integer",
  "Long",
  "Double",
  "Float",
  "Boolean",
  "Date",
];

const processFields = (input) => {
  const modelName = extractModelName(input);
  const requiredFields = [
    { name: "id", dataType: "Long", comment: null },
    { name: "status", dataType: "Integer", comment: null },
  ];
  const fields = extractFields(input, requiredFields);
  return { model: modelName, fields };
};

const extractModelName = (input) => {
  const modelNameMatch = input.match(/public\s+class\s+(\w+)/);
  return modelNameMatch ? modelNameMatch[1] : null;
};

const extractFields = (input, requiredFields) => {
  const lines = input
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) =>
      line
        .trim()
        .replace(/\s*\/\/.*$/, (comment) => comment.trim())
        .replace(/\s+/g, " ")
    );

  const processedFields = lines
    .filter((line) => line.startsWith("private ") && !line.includes("List<"))
    .map((line) => {
      const cleanedLine = line.replace(/\s*=\s*[^;]+/, "");
      const [_, dataType, name] =
        cleanedLine.match(/private\s+(\w+)\s+(\w+);/) || [];
      const comment = line.match(/\/\/(.+)/)?.[1]?.trim() || null;

      return { dataType, name, comment };
    })
    .filter(Boolean);
  return ensureFieldsExist(processedFields, requiredFields);
};

const ensureFieldsExist = (fields, requiredFields) => {
  requiredFields.forEach((field) => {
    const exists = fields.some(
      (f) => f.name === field.name && f.dataType === field.dataType
    );
    if (!exists) {
      fields.push(field);
    }
  });
  return fields;
};

// ========================================= Repository

const generateRepositoryClass = (modelName) => {
  return `import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ${modelName}Repository extends JpaRepository<${modelName}, Long>, JpaSpecificationExecutor<${modelName}> {
}`;
};

// ================================= Criteria

const generateCriteriaClass = (modelName, fields) => {
  let classFields = [];
  let result = `import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.Predicate;

@Getter
@Setter
public class ${modelName}Criteria {
`;

  fields.forEach((field) => {
    if (javaDatatypes.includes(field.dataType)) {
      if (field.dataType === "Date") {
        classFields.push(`    private Date ${field.name};`);
      } else if (field.dataType === "String") {
        classFields.push(`    private String ${field.name};`);
      } else {
        classFields.push(`    private ${field.dataType} ${field.name};`);
      }
    } else {
      classFields.push(`    private Long ${field.name}Id;`);
    }
  });

  result += classFields.join("\n") + "\n\n";

  result += `    public Specification<${modelName}> getCriteria() {\n        return (root, query, cb) -> {\n            List<Predicate> predicates = new ArrayList<>();`;

  fields.forEach((field) => {
    if (javaDatatypes.includes(field.dataType)) {
      if (field.dataType === "String") {
        result += `
            if (StringUtils.isNotBlank(get${capitalize(field.name)}())) {
                predicates.add(cb.like(cb.lower(root.get("${
                  field.name
                }")), \"%\" + get${capitalize(
          field.name
        )}().toLowerCase() + \"%\"));
            }`;
      } else if (field.dataType === "Date") {
        result += `
            if (get${capitalize(field.name)}() != null) {
                predicates.add(cb.equal(root.get("${
                  field.name
                }").as(LocalDate.class), get${capitalize(
          field.name
        )}().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()));
            }`;
      } else {
        result += `
            if (get${capitalize(field.name)}() != null) {
                predicates.add(cb.equal(root.get("${
                  field.name
                }"), get${capitalize(field.name)}()));
            }`;
      }
    } else {
      result += `
            if (get${capitalize(field.name)}Id() != null) {
                Join<${modelName}, ${field.dataType}> join = root.join("${
        field.name
      }", JoinType.INNER);
                predicates.add(cb.equal(join.get("id"), get${capitalize(
                  field.name
                )}Id()));
            }`;
    }
  });

  result += `
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}`;

  return result;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ================================================ VALIDATION

const generateAppConstant = (modelName, fields) => {
  const prefix = modelName.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
  const constantsByGroup = fields
    .filter((field) => field.dataType === "Integer" && field.comment)
    .reduce((acc, field) => {
      const regex = /(\d+)\s*:\s*(\w+)/g;
      let match;
      const fieldGroup = field.name
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .toUpperCase();

      while ((match = regex.exec(field.comment)) !== null) {
        const value = match[1];
        const label = match[2].toUpperCase();
        const constant = `    public static final Integer ${prefix}_${fieldGroup}_${label} = ${value};`;
        if (!acc[fieldGroup]) acc[fieldGroup] = [];
        acc[fieldGroup].push(constant);
      }
      return acc;
    }, {});

  if (Object.keys(constantsByGroup).length === 0) return null;

  const groupedConstants = Object.entries(constantsByGroup)
    .map(([group, constants]) => constants.join("\n"))
    .join("\n\n");

  return `public class AppConstant {\n${groupedConstants}\n}`;
};

const generateValidation = (modelName, integerField) => {
  const prefix = modelName.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
  if (integerField.dataType !== "Integer" || !integerField.comment) return null;

  const regex = /(\d+)\s*:\s*(\w+)/g;
  const constants = [];
  let match;
  while ((match = regex.exec(integerField.comment)) !== null) {
    constants.push(
      `AppConstant.${prefix}_${integerField.name
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .toUpperCase()}_${match[2].toUpperCase()}`
    );
  }

  const label = `${modelName}${capitalize(integerField.name)}`;

  const model = capitalize(
    modelName.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()
  );

  const annotation = `import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ${label}Validation.class)
@Documented
public @interface ${label} {
    boolean allowNull() default false;
    String message() default "${model} ${integerField.name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()} is invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

/* =========================================================== */`;

  const implementation = `import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class ${label}Validation implements ConstraintValidator<${label}, Integer> {
    private boolean allowNull;

    @Override
    public void initialize(${label} constraintAnnotation) {
        allowNull = constraintAnnotation.allowNull();
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null ? allowNull : List.of(
                ${constants.join(",\n                ")}
        ).contains(value);
    }
}

/* =========================================================== */`;

  return { annotation, implementation };
};

// ==================================================== DTO

const generateDtoClass = (modelName, fields) => {
  let dtoFields = [];
  const dtoClassName = `${modelName}Dto`;

  let result = `import lombok.Data;

@Data
public class ${dtoClassName} extends ABasicAdminDto {`;

  fields.forEach((field) => {
    if (field.name !== "id" && field.name !== "status") {
      if (javaDatatypes.includes(field.dataType)) {
        dtoFields.push(`    private ${field.dataType} ${field.name};`);
      } else {
        dtoFields.push(`    private ${field.dataType}Dto ${field.name};`);
      }
    }
  });

  result += "\n" + dtoFields.join("\n") + "\n}";

  return result;
};

// ==================================================== FORM

const generateFormClasses = (modelName, fields) => {
  const createFormName = `Create${modelName}Form`;
  const updateFormName = `Update${modelName}Form`;

  const generateFieldAnnotation = (field, isCreate) => {
    const annotations = [];
    const { dataType, name, comment } = field;

    const fieldName = javaDatatypes.includes(dataType) ? name : `${name}Id`;

    if (isCreate && fieldName === "id") return null;
    if (comment && comment.includes(":")) {
      const customValidation = `${modelName}${capitalize(name)}`;
      annotations.push(`@${customValidation}`);
    } else if (fieldName === "id")
      annotations.push(`@NotNull(message = "id cannot be null")`);
    else if (["String"].includes(dataType)) {
      annotations.push(`@NotBlank(message = "${fieldName} cannot be blank")`);
    } else {
      annotations.push(`@NotNull(message = "${fieldName} cannot be null")`);
    }

    annotations.push(`@ApiModelProperty(required = true)`);

    const fieldType = javaDatatypes.includes(dataType) ? dataType : "Long";

    return `${annotations.join(
      "\n    "
    )}\n    private ${fieldType} ${fieldName};`;
  };

  const createFormFields = fields
    .map((field) => generateFieldAnnotation(field, true))
    .filter((field) => field !== null)
    .join("\n    ");

  const updateFormFields = fields
    .map((field) => generateFieldAnnotation(field, false))
    .join("\n    ");

  const createForm = `import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ${createFormName} {
    ${createFormFields}
}`;

  const updateForm = `import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ${updateFormName} {
    ${updateFormFields}
}`;

  return { createForm, updateForm };
};

// ==================================================== MAPPER

const generateMapper = (modelName, fields) => {
  const dtoName = `${modelName}Dto`;
  const createFormName = `Create${modelName}Form`;
  const updateFormName = `Update${modelName}Form`;
  const entityName = modelName;

  const relatedEntities = fields
    .filter((field) => !javaDatatypes.includes(field.dataType))
    .map((field) => `${field.dataType}Mapper.class`)
    .join(", ");

  const uses = relatedEntities ? `uses = {${relatedEntities}},` : "";

  const createFormMappings = fields
    .filter(
      (field) => field.name !== "id" && javaDatatypes.includes(field.dataType)
    )
    .map(
      (field) =>
        `    @Mapping(source = "${field.name}", target = "${field.name}")`
    )
    .join("\n");

  const updateFormMappings = fields
    .filter(
      (field) => field.name !== "id" && javaDatatypes.includes(field.dataType)
    )
    .map(
      (field) =>
        `    @Mapping(source = "${field.name}", target = "${field.name}")`
    )
    .join("\n");

  const dtoMappings = fields
    .map((field) => {
      if (javaDatatypes.includes(field.dataType)) {
        return `    @Mapping(source = "${field.name}", target = "${field.name}")`;
      } else {
        return `    @Mapping(source = "${field.name}", target = "${
          field.name
        }", qualifiedByName = "fromEntityTo${capitalize(field.name)}Dto")`;
      }
    })
    .concat(`    @Mapping(source = "createdDate", target = "createdDate")`)
    .join("\n");

  const autocompleteFields = fields
    .filter((field) => field.name === "id" || field.dataType === "String")
    .slice(0, 2)
    .map(
      (field) =>
        `    @Mapping(source = "${field.name}", target = "${field.name}")`
    )
    .join("\n");

  return `import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", ${uses}
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ${modelName}Mapper {
${
  createFormMappings ? `${createFormMappings}\n` : ""
}    @BeanMapping(ignoreByDefault = true)\n    ${entityName} fromCreate${modelName}FormToEntity(${createFormName} create${modelName}Form);

${
  updateFormMappings ? `${updateFormMappings}\n` : ""
}    @BeanMapping(ignoreByDefault = true)\n    void fromUpdate${modelName}FormToEntity(${updateFormName} update${modelName}Form, @MappingTarget ${entityName} ${entityName.toLowerCase()});

${dtoMappings ? `${dtoMappings}\n` : ""}    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityTo${modelName}Dto")\n    ${dtoName} fromEntityTo${modelName}Dto(${entityName} ${entityName.toLowerCase()});

    @IterableMapping(elementTargetType = ${dtoName}.class, qualifiedByName = "fromEntityTo${modelName}Dto")
    List<${dtoName}> fromEntityListTo${modelName}DtoList(List<${entityName}> ${entityName.toLowerCase()}List);

${
  autocompleteFields ? `${autocompleteFields}\n` : ""
}    @BeanMapping(ignoreByDefault = true)
    @Named("fromEntityTo${modelName}DtoAutoComplete")\n    ${dtoName} fromEntityTo${modelName}DtoAutoComplete(${entityName} ${entityName.toLowerCase()});

    @IterableMapping(elementTargetType = ${dtoName}.class, qualifiedByName = "fromEntityTo${modelName}DtoAutoComplete")
    List<${dtoName}> fromEntityListTo${modelName}DtoListAutoComplete(List<${entityName}> ${entityName.toLowerCase()}List);
}`;
};

// ========================================================== ERROR CODE

const generateErrorCode = (modelName) => {
  return `public class ErrorCode {
    /**
     * Starting error code ${modelName.replace(/([a-z])([A-Z])/g, "$1 $2")}
     */
    public static final String ${modelName
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toUpperCase()}_ERROR_NOT_FOUND = "ERROR-${modelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toUpperCase()}-0000";
}`;
};

// ======================================================== CONTROLLER

const getModelPrefix = (modelName) => {
  const words = modelName.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
  if (words.length === 1) {
    return modelName.length <= 3
      ? modelName.toUpperCase()
      : modelName.slice(0, 3).toUpperCase();
  } else {
    const firstPart = words[0].slice(0, 3).toUpperCase();
    const restPart = words
      .slice(1)
      .map((word) => word[0].toUpperCase())
      .join("_");
    return `${firstPart}_${restPart}`;
  }
};

const generateController = (modelName, fields) => {
  const upperModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const lowerModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const modelPrefix = getModelPrefix(modelName);
  const relatedEntities = fields.filter(
    (field) => !javaDatatypes.includes(field.dataType)
  );

  let autowiredRepos = "";
  let findRelatedEntities = "";

  relatedEntities.forEach((field) => {
    const repoName = `${field.dataType}Repository`;
    const lowerRepoName =
      field.dataType.charAt(0).toLowerCase() + field.dataType.slice(1);
    autowiredRepos += `    @Autowired\n    private ${repoName} ${lowerRepoName}Repository;\n`;
    findRelatedEntities += `    
        ${field.dataType} ${
      field.name
    } = ${lowerRepoName}Repository.findById(form.get${
      field.name.charAt(0).toUpperCase() + field.name.slice(1)
    }Id()).orElse(null);
        if (${field.name} == null) {
            throw new BadRequestException(ErrorCode.${field.dataType
              .replace(/([a-z])([A-Z])/g, "$1_$2")
              .toUpperCase()}_ERROR_NOT_FOUND, "Not found ${field.name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()}");
        }
        ${lowerModelName}.set${
      field.name.charAt(0).toUpperCase() + field.name.slice(1)
    }(${field.name});`;
  });

  return `import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/v1/${lowerModelName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()}")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ${upperModelName}Controller extends ABasicController {
    @Autowired
    private ${upperModelName}Repository ${lowerModelName}Repository;
    @Autowired
    private ${upperModelName}Mapper ${lowerModelName}Mapper;
${autowiredRepos}
    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('${modelPrefix}_V')")
    public ApiMessageDto<${upperModelName}Dto> get(@PathVariable("id") Long id) {
        ${upperModelName} ${lowerModelName} = ${lowerModelName}Repository.findById(id).orElse(null);
        if (${lowerModelName} == null) {
            throw new BadRequestException(ErrorCode.${upperModelName
              .replace(/([a-z])([A-Z])/g, "$1_$2")
              .toUpperCase()}_ERROR_NOT_FOUND, "Not found ${lowerModelName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()}");
        }
        return makeSuccessResponse(${lowerModelName}Mapper.fromEntityTo${upperModelName}Dto(${lowerModelName}), "Get ${lowerModelName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()} success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('${modelPrefix}_L')")
    public ApiMessageDto<ResponseListDto<List<${upperModelName}Dto>>> list(${upperModelName}Criteria ${lowerModelName}Criteria, Pageable pageable) {
        Page<${upperModelName}> list${upperModelName} = ${lowerModelName}Repository.findAll(${lowerModelName}Criteria.getCriteria(), pageable);
        ResponseListDto<List<${upperModelName}Dto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(${lowerModelName}Mapper.fromEntityListTo${upperModelName}DtoList(list${upperModelName}.getContent()));
        responseListObj.setTotalPages(list${upperModelName}.getTotalPages());
        responseListObj.setTotalElements(list${upperModelName}.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<${upperModelName}Dto>>> autoComplete(${upperModelName}Criteria ${lowerModelName}Criteria) {
        Pageable pageable = PageRequest.of(0, 10);
        ${lowerModelName}Criteria.setStatus(AppConstant.STATUS_ACTIVE);
        Page<${upperModelName}> list${upperModelName} = ${lowerModelName}Repository.findAll(${lowerModelName}Criteria.getCriteria(), pageable);
        ResponseListDto<List<${upperModelName}Dto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(${lowerModelName}Mapper.fromEntityListTo${upperModelName}DtoListAutoComplete(list${upperModelName}.getContent()));
        responseListObj.setTotalPages(list${upperModelName}.getTotalPages());
        responseListObj.setTotalElements(list${upperModelName}.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list auto-complete ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('${modelPrefix}_C')")
    public ApiMessageDto<String> create(@Valid @RequestBody Create${upperModelName}Form form, BindingResult bindingResult) {
        ${upperModelName} ${lowerModelName} = ${lowerModelName}Mapper.fromCreate${upperModelName}FormToEntity(form);
        ${findRelatedEntities}
        ${lowerModelName}Repository.save(${lowerModelName});
        return makeSuccessResponse(null, "Create ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }

    @PutMapping(value = "/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('${modelPrefix}_U')")
    public ApiMessageDto<String> update(@Valid @RequestBody Update${upperModelName}Form form, BindingResult bindingResult) {
        ${upperModelName} ${lowerModelName} = ${lowerModelName}Repository.findById(form.getId()).orElse(null);
        if (${lowerModelName} == null) {
            throw new BadRequestException(ErrorCode.${upperModelName
              .replace(/([a-z])([A-Z])/g, "$1_$2")
              .toUpperCase()}_ERROR_NOT_FOUND, "Not found ${lowerModelName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()}");
        }
        ${lowerModelName}Mapper.fromUpdate${upperModelName}FormToEntity(form, ${lowerModelName});
${findRelatedEntities}
        ${lowerModelName}Repository.save(${lowerModelName});
        return makeSuccessResponse(null, "Update ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('${modelPrefix}_D')")
    public ApiMessageDto<String> delete(@PathVariable("id") Long id) {
        ${upperModelName} ${lowerModelName} = ${lowerModelName}Repository.findById(id).orElse(null);
        if (${lowerModelName} == null) {
            throw new BadRequestException(ErrorCode.${upperModelName
              .replace(/([a-z])([A-Z])/g, "$1_$2")
              .toUpperCase()}_ERROR_NOT_FOUND, "Not found ${lowerModelName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()}");
        }
        ${lowerModelName}Repository.deleteById(id);
        return makeSuccessResponse(null, "Delete ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }
}`;
};

// ==================================================== TEST

const input = `
@Getter
@Setter
@Entity
@Table(name = "db_app_account")
@EntityListeners(AuditingEntityListener.class)
public class AccountDepTrai extends Auditable<String> {
    @Id
    @GeneratedValue(generator = AppConstant.APP_ID_GENERATOR_NAME)
    @GenericGenerator(name = AppConstant.APP_ID_GENERATOR_NAME, strategy = AppConstant.APP_ID_GENERATOR_STRATEGY)
    private Long id;
    private Integer kind; // 1: admin, 2: manager, 3:user
    @Column(unique = true)
    private String username;
    @Column(unique = true)
    private String phone;
    @Column(unique = true)
    private String email;
    @JsonIgnore
    private String password;
    private String fullName;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;
    private Group2 group2;
    private Date lastLogin;
    private String avatar;
    private String resetPasswordCode;
    private Date resetPasswordTime;
    @Column(name = "attempt_forget_password")
    private Integer attemptCode;
    private Integer attemptLoginHeHe; // 1: admin, 2: manager, 3:user
    private Boolean isSuperAdmin = false;
}`;

const result = processFields(input);
const repository = generateRepositoryClass(result.model);
const criteria = generateCriteriaClass(result.model, result.fields);
const constantsCode = generateAppConstant(result.model, result.fields);
const dto = generateDtoClass(result.model, result.fields);
const { createForm, updateForm } = generateFormClasses(
  result.model,
  result.fields
);
const mapper = generateMapper(result.model, result.fields);
const errorCode = generateErrorCode(result.model);
const controller = generateController(result.model, result.fields);

// console.log(repository);
// console.log(criteria);
// console.log(constantsCode);
// for (const field of result.fields) {
//   if (field.comment && field.dataType === "Integer") {
//     const { annotation, implementation } = generateValidation(
//       result.model,
//       field
//     );
//     console.log(annotation);
//     console.log(implementation);
//   }
// }
// console.log(dto);
// console.log(createForm);
// console.log(updateForm);
// console.log(mapper);
// console.log(errorCode);
// console.log(controller);

// ================================================== MAIN FUNC

const generateOutput = (input) => {
  const result = processFields(input);
  const repository = generateRepositoryClass(result.model);
  const criteria = generateCriteriaClass(result.model, result.fields);
  const constantsCode = generateAppConstant(result.model, result.fields);
  const dto = generateDtoClass(result.model, result.fields);
  const { createForm, updateForm } = generateFormClasses(
    result.model,
    result.fields
  );
  const mapper = generateMapper(result.model, result.fields);
  const errorCode = generateErrorCode(result.model);
  const controller = generateController(result.model, result.fields);

  const validations = [];
  for (const field of result.fields) {
    if (field.comment && field.dataType === "Integer") {
      const { annotation, implementation } = generateValidation(
        result.model,
        field
      );
      validations.push({ annotation, implementation });
    }
  }

  return {
    repository,
    criteria,
    constantsCode,
    dto,
    createForm,
    updateForm,
    mapper,
    errorCode,
    controller,
    validations,
  };
};
