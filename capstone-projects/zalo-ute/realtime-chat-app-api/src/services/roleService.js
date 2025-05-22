import { formatDate } from "../configurations/schemaConfig.js";
import Role from "../models/roleModel.js";

const formatRoleData = (role) => ({
  _id: role._id,
  name: role.name,
  kind: role.kind,
  createdAt: formatDate(role.createdAt),
  updatedAt: formatDate(role.updatedAt),
  permissions:
    role.permissions?.map((permission) => ({
      _id: permission._id,
      name: permission.name,
      permissionCode: permission.permissionCode,
    })) || [],
});

const getListRoles = async (req) => {
  const {
    name,
    kind,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let roleQuery = {};
  if (name) {
    roleQuery.name = { $regex: name, $options: "i" };
  }
  if (kind) {
    roleQuery.kind = Number(kind);
  }

  const [totalElements, roles] = await Promise.all([
    Role.countDocuments(roleQuery),
    Role.find(roleQuery)
      .select("-permissions")
      .sort({ updatedAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = roles.map((role) => {
    return formatRoleData(role);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListRoles, formatRoleData };
