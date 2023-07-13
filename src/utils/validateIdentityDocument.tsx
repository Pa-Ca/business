const REGEX_ONLY_NUMBER = 
    /^[0-9]*$/;
export default (type: string, id: string,) => {
    const result: { processedIdentityDocumentType: string; 
                    processedIdentityDocument: string; 
                    code: number } = {
        processedIdentityDocumentType: type.trim(),
        processedIdentityDocument: id.trim(),
        code: 0,
    };

    if (result.processedIdentityDocument.length == 0 ) {
        result.code = 1;
    }
    else if (type != "P" && !REGEX_ONLY_NUMBER.test(result.processedIdentityDocument)) {
        result.code = 2;
    }

    return result;
};