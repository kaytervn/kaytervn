const javaDatatypes = [
  "String",
  "Integer",
  "Long",
  "Double",
  "Float",
  "Boolean",
  "Date",
];

const processFields = (input: any) => {
  const modelName = extractModelName(input);
  const requiredFields = [
    { name: "id", dataType: "Long", comment: null },
    { name: "status", dataType: "Integer", comment: null },
  ];
  const fields = extractFields(input, requiredFields);
  return { model: modelName, fields };
};

const extractModelName = (input: any) => {
  const modelNameMatch = input.match(/public\s+class\s+(\w+)/);
  return modelNameMatch ? modelNameMatch[1] : null;
};

const extractFields = (input: any, requiredFields: any) => {
  const lines = input
    .split("\n")
    .filter((line: any) => line.trim() !== "")
    .map((line: any) =>
      line
        .trim()
        .replace(/\s*\/\/.*$/, (comment: any) => comment.trim())
        .replace(/\s+/g, " ")
    );

  const processedFields = lines
    .filter(
      (line: any) => line.startsWith("private ") && !line.includes("List<")
    )
    .map((line: any) => {
      const cleanedLine = line.replace(/\s*=\s*[^;]+/, "");
      const [_, dataType, name] =
        cleanedLine.match(/private\s+(\w+)\s+(\w+);/) || [];
      const comment = line.match(/\/\/(.+)/)?.[1]?.trim() || null;

      return { dataType, name, comment };
    })
    .filter(Boolean);
  return ensureFieldsExist(processedFields, requiredFields);
};

const ensureFieldsExist = (fields: any, requiredFields: any) => {
  requiredFields.forEach((field: any) => {
    const exists = fields.some(
      (f: any) => f.name === field.name && f.dataType === field.dataType
    );
    if (!exists) {
      fields.push(field);
    }
  });
  return fields;
};

// ========================================= Repository

const generateRepositoryClass = (modelName: any) => {
  return `import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ${modelName}Repository extends JpaRepository<${modelName}, Long>, JpaSpecificationExecutor<${modelName}> {
}`;
};

// ================================= Criteria

const generateCriteriaClass = (modelName: any, fields: any) => {
  let classFields: any = [];
  let result = `import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ${modelName}Criteria {
`;

  fields.forEach((field: any) => {
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

  if (containOrdering(fields)) {
    classFields.push(`    private Integer isPaged = AppConstant.BOOLEAN_TRUE;`);
  }

  result += classFields.join("\n") + "\n\n";

  result += `    public Specification<${modelName}> getCriteria() {\n        return (root, query, cb) -> {\n            List<Predicate> predicates = new ArrayList<>();`;

  fields.forEach((field: any) => {
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

const capitalize = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ================================================ VALIDATION

const containOrdering = (fields: any[]): boolean => {
  return fields.some(
    (field) => field.dataType === "Integer" && field.name === "ordering"
  );
};

const generateAppConstant = (
  modelName: string,
  fields: any[]
): string | null => {
  const prefix = modelName.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();

  const extraConstants = containOrdering(fields)
    ? `    public static final Integer BOOLEAN_FALSE = 0;\n    public static final Integer BOOLEAN_TRUE = 1;`
    : "";

  const constantsByGroup = fields
    .filter((field) => field.dataType === "Integer" && field.comment)
    .reduce((acc: Record<string, string[]>, field) => {
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

  if (Object.keys(constantsByGroup).length === 0 && !extraConstants) {
    return null;
  }

  const groupedConstants = Object.entries(constantsByGroup)
    .map(([_, constants]) => constants.join("\n"))
    .join("\n\n");

  const allConstants = [extraConstants, groupedConstants]
    .filter(Boolean)
    .join("\n\n");

  return `public class AppConstant {\n${allConstants}\n}`;
};

const generateValidation = (modelName: any, integerField: any) => {
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
}`;

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
}`;

  return { annotation, implementation };
};

// ==================================================== DTO

const generateDtoClass = (modelName: any, fields: any) => {
  let dtoFields: any = [];
  const dtoClassName = `${modelName}Dto`;

  let result = `import lombok.Data;

@Data
public class ${dtoClassName} extends ABasicAdminDto {`;

  fields.forEach((field: any) => {
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

const generateFormClasses = (modelName: any, fields: any) => {
  const createFormName = `Create${modelName}Form`;
  const updateFormName = `Update${modelName}Form`;
  const updateSortFormName = `UpdateSort${modelName}Form`;

  const generateFieldAnnotation = (field: any, isCreate: any) => {
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
    .map((field: any) => generateFieldAnnotation(field, true))
    .filter((field: any) => field !== null)
    .join("\n    ");

  const updateFormFields = fields
    .map((field: any) => generateFieldAnnotation(field, false))
    .join("\n    ");

  const createForm = `import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ${createFormName} {
    ${createFormFields}
}`;

  const updateForm = `import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class ${updateFormName} {
    ${updateFormFields}
}`;

  const forms: any = { createForm, updateForm };

  if (containOrdering(fields)) {
    forms.updateSortForm = `import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class ${updateSortFormName} {
    @NotNull(message = "id cannot be null")
    @ApiModelProperty(required = true)
    private Long id;
    @NotNull(message = "ordering cannot be null")
    @ApiModelProperty(required = true)
    private Integer ordering;
}`;
  }

  return forms;
};

// ==================================================== MAPPER

const generateMapper = (modelName: any, fields: any) => {
  const dtoName = `${modelName}Dto`;
  const createFormName = `Create${modelName}Form`;
  const updateFormName = `Update${modelName}Form`;
  const entityName = modelName;

  const relatedEntities = fields
    .filter((field: any) => !javaDatatypes.includes(field.dataType))
    .map((field: any) => `${field.dataType}Mapper.class`)
    .join(", ");

  const uses = relatedEntities ? `uses = {${relatedEntities}},` : "";

  const createFormMappings = fields
    .filter(
      (field: any) =>
        field.name !== "id" && javaDatatypes.includes(field.dataType)
    )
    .map(
      (field: any) =>
        `    @Mapping(source = "${field.name}", target = "${field.name}")`
    )
    .join("\n");

  const updateFormMappings = fields
    .filter(
      (field: any) =>
        field.name !== "id" && javaDatatypes.includes(field.dataType)
    )
    .map(
      (field: any) =>
        `    @Mapping(source = "${field.name}", target = "${field.name}")`
    )
    .join("\n");

  const dtoMappings = fields
    .map((field: any) => {
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
    .filter((field: any) => field.name === "id" || field.dataType === "String")
    .slice(0, 2)
    .map(
      (field: any) =>
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

const generateErrorCode = (modelName: any) => {
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

const getModelPrefix = (modelName: any) => {
  const words = modelName.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
  if (words.length === 1) {
    return modelName.length <= 3
      ? modelName.toUpperCase()
      : modelName.slice(0, 3).toUpperCase();
  } else {
    const firstPart = words[0].slice(0, 3).toUpperCase();
    const restPart = words
      .slice(1)
      .map((word: any) => word[0].toUpperCase())
      .join("_");
    return `${firstPart}_${restPart}`;
  }
};

const generateController = (modelName: any, fields: any) => {
  const upperModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  const lowerModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const modelPrefix = getModelPrefix(modelName);
  const relatedEntities = fields.filter(
    (field: any) => !javaDatatypes.includes(field.dataType)
  );

  let autowiredRepos = "";
  let findRelatedEntities = "";

  relatedEntities.forEach((field: any) => {
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

  const sortOrdering = containOrdering(fields)
    ? `if (AppConstant.BOOLEAN_FALSE.equals(${lowerModelName}Criteria.getIsPaged())) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("ordering").ascending().and(Sort.by("createdDate").descending()));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("ordering").ascending().and(Sort.by("createdDate").descending()));
        }\n        `
    : "";

  const sortOrderingAutoComplete = containOrdering(fields)
    ? `if (AppConstant.BOOLEAN_FALSE.equals(${lowerModelName}Criteria.getIsPaged())) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by("ordering").ascending().and(Sort.by("createdDate").descending()));
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("ordering").ascending().and(Sort.by("createdDate").descending()));
        }\n        `
    : "";

  const updateSortEndpoint = containOrdering(fields)
    ? `    \n\n    @PutMapping(value = "/update-sort", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('${modelPrefix}_U_S')")
    public ApiMessageDto<String> updateSort(@Valid @RequestBody List<UpdateSort${upperModelName}Form> forms, BindingResult bindingResult) {
        Map<Long, Integer> ordering = forms.stream().collect(Collectors.toMap(UpdateSort${upperModelName}Form::getId, UpdateSort${upperModelName}Form::getOrdering));
        List<${upperModelName}> list${upperModelName} = ${lowerModelName}Repository.findAllById(ordering.keySet());
        for (${upperModelName} ${lowerModelName} : list${upperModelName}) {
            if (${lowerModelName} != null) {
                ${lowerModelName}.setOrdering(ordering.get(${lowerModelName}.getId()));
            }
        }
        ${lowerModelName}Repository.saveAll(list${upperModelName});
        return makeSuccessResponse(null, "Update sort ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }`
    : "";

  return `import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
        ${sortOrdering}Page<${upperModelName}> list${upperModelName} = ${lowerModelName}Repository.findAll(${lowerModelName}Criteria.getCriteria(), pageable);
        ResponseListDto<List<${upperModelName}Dto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(${lowerModelName}Mapper.fromEntityListTo${upperModelName}DtoList(list${upperModelName}.getContent()));
        responseListObj.setTotalPages(list${upperModelName}.getTotalPages());
        responseListObj.setTotalElements(list${upperModelName}.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list ${lowerModelName
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .toLowerCase()} success");
    }

    @GetMapping(value = "/auto-complete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<${upperModelName}Dto>>> autoComplete(${upperModelName}Criteria ${lowerModelName}Criteria, @PageableDefault Pageable pageable) {
        ${sortOrderingAutoComplete}${lowerModelName}Criteria.setStatus(AppConstant.STATUS_ACTIVE);
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
        ${upperModelName} ${lowerModelName} = ${lowerModelName}Mapper.fromCreate${upperModelName}FormToEntity(form);${findRelatedEntities}
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
        ${lowerModelName}Mapper.fromUpdate${upperModelName}FormToEntity(form, ${lowerModelName});${findRelatedEntities}
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
    }${updateSortEndpoint}
}`;
};

// ================================================== MAIN FUNC

const generateOutput = (input: any) => {
  const result = processFields(input);
  const upperModelName =
    result.model.charAt(0).toUpperCase() + result.model.slice(1);
  const repository = generateRepositoryClass(result.model);
  const criteria = generateCriteriaClass(result.model, result.fields);
  const constantsCode = generateAppConstant(result.model, result.fields);
  const dto = generateDtoClass(result.model, result.fields);
  const { createForm, updateForm, updateSortForm } = generateFormClasses(
    result.model,
    result.fields
  );
  const mapper = generateMapper(result.model, result.fields);
  const errorCode = generateErrorCode(result.model);
  const controller = generateController(result.model, result.fields);

  const validations = [];
  for (const field of result.fields) {
    if (field.comment && field.dataType === "Integer") {
      const { annotation, implementation }: any = generateValidation(
        result.model,
        field
      );
      validations.push(
        {
          name: `${upperModelName}${capitalize(field.name)}`,
          value: annotation,
        },
        {
          name: `${upperModelName}${capitalize(field.name)}Validation`,
          value: implementation,
        }
      );
    }
  }

  return [
    {
      name: upperModelName + "Repository",
      value: repository,
    },
    {
      name: upperModelName + "Criteria",
      value: criteria,
    },
    {
      name: "AppConstant",
      value: constantsCode,
    },
    ...validations,
    {
      name: upperModelName + "Dto",
      value: dto,
    },
    {
      name: "Create" + upperModelName + "Form",
      value: createForm,
    },
    {
      name: "Update" + upperModelName + "Form",
      value: updateForm,
    },
    {
      name: "UpdateSort" + upperModelName + "Form",
      value: updateSortForm,
    },
    {
      name: upperModelName + "Mapper",
      value: mapper,
    },
    {
      name: "ErrorCode",
      value: errorCode,
    },
    {
      name: upperModelName + "Controller",
      value: controller,
    },
  ].filter((item) => item.value !== undefined && item.value !== null);
};

export { generateOutput };
