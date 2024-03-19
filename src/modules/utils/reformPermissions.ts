import Action from '../../config/actions';
import Resource from '../../config/resources';

const convertRequiredRights = (specificRights: Partial<Record<Resource, Action[]>>): Record<Resource, Action[]> => {
  const defaultRights: Record<Resource, Action[]> = {} as Record<Resource, Action[]>;

  for (const resource of Object.values(Resource)) {
    defaultRights[resource] = [];
  }

  for (const resource in specificRights) {
    if (Object.prototype.hasOwnProperty.call(specificRights, resource)) {
      defaultRights[resource as Resource] = specificRights[resource as Resource] || [];
    }
  }

  return defaultRights;
};

export default convertRequiredRights;
