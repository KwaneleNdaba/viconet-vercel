
import { match } from "assert";
import { IPersonnel, IPersonnelDoc } from "../models/personnel";

export const SearchByKey = async function(searchKey: string, personnel: IPersonnelDoc[]): Promise<IPersonnel[]> {
  console.log("SER", searchKey.split(","));
  const searchKeySet = new Set(searchKey.split(","));

  const matches = personnel
    .map((x) => {
      return { matchCount: CompareHash(Array.from(searchKeySet), x), personnel: x };
    })
    .filter((x) => x.matchCount > 0);
    console.log("SEARCH",matches);
  matches.sort((a, b) => b.matchCount - a.matchCount);
  return matches.map((match) => match.personnel);
  
}

function CompareHash(searchTerms: string[], personnel: IPersonnelDoc): number {
  const res = ConvertToHashMap(personnel.searchKeys?.split(","));
  const matchCount = searchTerms.reduce((count, term) => {
  
    if (res[term] === true) {
      return count + 1;
    }
    return count;
  }, 0);

  return matchCount;
}

function ConvertToHashMap(array: string[]): any {
  const result = array.reduce(function (res, obj) {
    return { ...res, [obj]: true };
  }, {});
  return result;  
}


export function GenerateSearchKeys(personnel: IPersonnel){

  const skillsKey = personnel.keySkills?.map(x=> `${x}`).join(",");
  const coursesKey = personnel.keyCourses?.map(x=> `${x}`).join(",");

  const education = personnel.education?.map(x=>`${x.qualification}`).join(",");
  const roles = personnel.currentJob?.responsibilities?.map(x=>`${x}`).join(",");
  const province = personnel?.personalInformation.province;
  const workMethod = personnel?.preferedWorkMethod;

  const fullKey = `${skillsKey},${coursesKey},${personnel.personalInformation.name},${personnel.personalInformation.surname},${education},${province},${roles},${'pwm'+workMethod}`;

   return fullKey;
  
}


