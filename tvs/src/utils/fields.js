export const getField = (fields, fieldName) => {
  const baseFieldName = fieldName.split('|')[0];
  return fields.find(f => f.name === baseFieldName);
};
