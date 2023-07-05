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
        console.log("SER", searchKey.split(","));
        const searchKeySet = new Set(searchKey.split(","));
        const matches = personnel
            .map((x) => {
            return { matchCount: CompareHash(Array.from(searchKeySet), x), personnel: x };
        })
            .filter((x) => x.matchCount > 0);
        console.log("SEARCH", matches);
        matches.sort((a, b) => b.matchCount - a.matchCount);
        return matches.map((match) => match.personnel);
    });
};
exports.SearchByKey = SearchByKey;
function CompareHash(searchTerms, personnel) {
    var _a;
    const res = ConvertToHashMap((_a = personnel.searchKeys) === null || _a === void 0 ? void 0 : _a.split(","));
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
    return result;
}
function GenerateSearchKeys(personnel) {
    var _a, _b, _c, _d, _e;
    const skillsKey = (_a = personnel.keySkills) === null || _a === void 0 ? void 0 : _a.map(x => `${x}`).join(",");
    const coursesKey = (_b = personnel.keyCourses) === null || _b === void 0 ? void 0 : _b.map(x => `${x}`).join(",");
    const education = (_c = personnel.education) === null || _c === void 0 ? void 0 : _c.map(x => `${x.qualification}`).join(",");
    const roles = (_e = (_d = personnel.currentJob) === null || _d === void 0 ? void 0 : _d.responsibilities) === null || _e === void 0 ? void 0 : _e.map(x => `${x}`).join(",");
    const province = personnel === null || personnel === void 0 ? void 0 : personnel.personalInformation.province;
    const workMethod = personnel === null || personnel === void 0 ? void 0 : personnel.preferedWorkMethod;
    const fullKey = `${skillsKey},${coursesKey},${personnel.personalInformation.name},${personnel.personalInformation.surname},${education},${province},${roles},${'pwm' + workMethod}`;
    return fullKey;
}
exports.GenerateSearchKeys = GenerateSearchKeys;
//# sourceMappingURL=searchService.js.map