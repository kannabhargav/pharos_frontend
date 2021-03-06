import {PharosBase, Serializer} from './pharos-base';
import gql from 'graphql-tag';
import {DataProperty} from '../tools/generic-table/components/property-display/data-property';
import {DiseaseAssocationSerializer, DiseaseAssociation} from './disease-association';

/**
 * apollo graphQL query fragment to retrieve common fields for a disease list view
 */
export const DISEASELISTFIELDS = gql`
  fragment diseasesListFields on Disease {
    name
    associationCount
    targetCounts {
      name
      value
    }
  }
`;

const DISEASEDETAILSQUERY = gql`
  #import "./diseasesListFields.gql"
  query fetchDiseaseDetails(
    $term: String,
    $associationtop: Int,
    $associationskip: Int,
  ) {
    diseases: disease(
      name: $term,
    ) {
      ...diseasesListFields
      uniprotDescription
      doDescription
      diseaseIDs:dids{
        id
        dataSources
        doName
        doDefinition
      }
      targetCounts {
        name
        value
      }
      associations(top: $associationtop, skip: $associationskip) {
        type
        name
        description
        zscore
        evidence
        conf
        log2foldchange
        drug
        source
      }
      parents{
        name
        associationCount
        targetCounts {
          name
          value
        }
      }
      children{
        name
        associationCount
        targetCounts {
          name
          value
        }
      }
    }
  }
  ${DISEASELISTFIELDS}
`;


/**
 * main disease object, mainly list of associated targets
 */
export class Disease {

  /**
   * fragment of common fields. fetched by the route resolver
   */
  static diseaseListFragments = DISEASELISTFIELDS;

  static diseaseDetailsQuery = DISEASEDETAILSQUERY;

  /**
   * name of disease
   */
  name: string;

  /**
   * number of disease associations
   */
  associationCount: number;

  uniprotDescription: string;
  doDescription: string;

  hasDOID(){
    return !!this.diseaseIDs?.find(id => {return id.id.toUpperCase().includes("DOID");});
  }

  diseaseIDs: DiseaseID[];

  /**
   * List of disease association objects
   */
  associations: DiseaseAssociation[];
  /**
   * number of targets related to disease association
   */
  targetCounts?: any[];

  targetCountsTotal: number;

  parents?: Disease[];
  children?: Disease[];
}

export class DiseaseID{
  id: string;
  dataSources: string[];
  doName: string;
  doDefinition: string;
}
/**
 * serializer for a disease object
 */
export class DiseaseSerializer implements Serializer {

  /**
   * no args constructor
   */
  constructor() {
  }

  /**
   * return disease object from json, mapping sublists
   * @param json
   * @return {Disease}
   */
  fromJson(json: any): Disease {
    const obj = new Disease();
    Object.entries((json)).forEach((prop) => obj[prop[0]] = prop[1]);

    if (json.associations) {
      const associationSerializer = new DiseaseAssocationSerializer();
      obj.associations = json.associations.map(assoc => associationSerializer.fromJson(assoc));
    }

    if (json.targetCounts) {
      obj.targetCountsTotal = json.targetCounts.reduce((prev, cur) => prev + cur.value, 0);
    }

    if(json.parents){
      obj.parents = json.parents.map(parent => this.fromJson(parent)).sort((a,b) => {return b.targetCountsTotal - a.targetCountsTotal});
    }

    if(json.children){
      obj.children = json.children.map(child => this.fromJson(child)).sort((a,b) => {return b.targetCountsTotal - a.targetCountsTotal});
    }

    return obj;
  }

  /**
   * flatten object to json
   * @param {PharosBase} obj
   * @return {any}
   */
  toJson(obj: PharosBase): any {
    return [];
  }

  /**
   * return properties from object
   * @param {Disease} disease
   * @return {any}
   * @private
   */
  _asProperties<T extends PharosBase>(obj: Disease): any {
    const newObj: any = this._mapField(obj);


    if (obj.associations) {
      const associationSerializer = new DiseaseAssocationSerializer();
      newObj.associations = obj.associations.map(ass => associationSerializer._asProperties(ass));
    }
    newObj.name.internalLink = ['/diseases', obj.name];
    //  newObj.id.internalLink = ['/diseases', obj.id];
    return newObj;
  }

  /**
   * recursive mapping function
   * @param obj
   * @return {{}}
   * @private
   */
  private _mapField(obj: any) {
    const retObj: {} = Object.assign({}, obj);
    Object.keys(obj).map(objField => {
      if (Array.isArray(obj[objField])) {
        retObj[objField] = obj[objField].map(arrObj => this._mapField(arrObj));
      } else {
        retObj[objField] = new DataProperty({name: objField, label: objField, term: obj[objField]});
      }
    });
    return retObj;
  }
}

