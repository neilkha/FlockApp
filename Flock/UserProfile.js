var UserProfile = (function() {

    var fullname = "";
    var email = "";
    var phone = "";

    var getName = function() {
        return fullname;
    };

    var setName = function(name) {
        fullname = name;
    };

    var getEmail = function() {
        return email
    };

    var setEmail = function(e) {
        email = e;
    };

    var getPhone = function() {
        return phone;
    };

    var setPhone = function(p) {
        phone = p;
    };

    return {
        getName: getName,
        setName: setName,
        getEmail: getEmail,
        setEmail: setEmail,
        getPhone: getPhone,
        setPhone: setPhone
    }

})();

export default UserProfile;