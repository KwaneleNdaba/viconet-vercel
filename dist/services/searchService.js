"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSearchKeys = exports.SearchByKey = void 0;
const SearchByKey = function (searchKey, personnel) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchKeySet = new Set(searchKey.split(","));
        const matches = personnel
            .map((x) => {
            return { matchCount: CompareHash(Array.from(searchKeySet), x), personnel: x };
        })
            .filter((x) => x.matchCount > 0);
        matches.sort((a, b) => b.matchCount - a.matchCount);
        return matches.map((match) => match.personnel);
    });
};
exports.SearchByKey = SearchByKey;
function CompareHash(searchTerms, personnel) {
    const res = ConvertToHashMap(personnel.searchKeys.split(","));
    const matchCount = searchTerms.reduce((count, term) => {
        if (res[term] === true) {
            return count + 1;
        }
        return count;
    }, 0);
    return matchCount;
}
function ConvertToHashMap(array) {
    const result = array.reduce(function (res, obj) {
        return Object.assign(Object.assign({}, res), { [obj]: true });
    }, {});
    console.log("conv", result);
    return result;
}
function GenerateSearchKeys(personnel) {
    const skillsKey = personnel.keySkills.map(x => `s${x}`).join(",");
    const coursesKey = personnel.keyCourses.map(x => `c${x}`).join(",");
    const fullKey = `${skillsKey},${coursesKey},${personnel.personalInformation.name},${personnel.personalInformation.surname},${personnel.education.qualification},${personnel.yearsOfExperience}`;
    return fullKey;
}
exports.GenerateSearchKeys = GenerateSearchKeys;
//# sourceMappingURL=searchService.js.map