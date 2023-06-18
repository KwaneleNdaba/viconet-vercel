
import { IPersonnel, IPersonnelDoc } from "../models/personnel";

export const SearchByKey = async function(searchKey: string, personnel: IPersonnelDoc[]): Promise<IPersonnelDoc[]> {
  const searchKeySet = new Set(searchKey.split(","));

  const matches = personnel
    .map((x) => {
      return { matchCount: CompareHash(Array.from(searchKeySet), x), personnel: x };
    })
    .filter((x) => x.matchCount > 0);

  matches.sort((a, b) => b.matchCount - a.matchCount);
  return matches.map((match) => match.personnel);
  
}

function CompareHash(searchTerms: string[], personnel: IPersonnelDoc): number {
  const res = ConvertToHashMap(personnel.searchKeys.split(","));
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
  console.log("conv",result);
  return result;  
}


export function GenerateSearchKeys(personnel: IPersonnel){

  const skillsKey = personnel.keySkills.map(x=> `s${x}`).join(",");
  const coursesKey = personnel.keyCourses.map(x=> `c${x}`).join(",");

  const fullKey = 
  `${skillsKey},${coursesKey},${personnel.personalInformation.name},${personnel.personalInformation.surname},${personnel.education.qualification},${personnel.yearsOfExperience}`;

   return fullKey;
  
}


