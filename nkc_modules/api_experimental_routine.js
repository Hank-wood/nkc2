
module.paths.push(__projectroot + 'nkc_modules'); //enable require-ment for this path

var operations = require('api_experimental_operations')
var table = operations.table
var permission = require('permissions')

function verifySubmittedParams(params){
  //verify whether the submitted object is valid

  if(!params.operation)throw 'no operation specified'
  var operation = table[params.operation]

  if(!operation) throw 'operation n/a, typo?'

  if(operation.requiredParams){
    for(i in operation.requiredParams){
      if(!params[i]) throw 'missing parameter: '+i
    }
  }

  return true;
}

function getPermissionList(user){
  //retain a list of permissions from user's certs property.
  if(!user)
  return permission.getPermissionsFromCerts(['visitor'])

  if(!user.certs)
  return permission.getPermissionsFromCerts(['visitor'])

  user.certs.push('visitor');

  //var permissionList = ['moveThread','editPost','replyToThread','replyToThread'];
  //permissionList = getPermissionFromCerts(user.certs)
  var permissionList = permission.getPermissionsFromCerts(user.certs)

  return permissionList;
}

function testPermission(params){
  // test if user is applicapable of executing operation specified by params.
  var permissionList = getPermissionList(params.user);
  report(permissionList);

  if(!permissionList[params.operation]){ //user does not have permission for this operation
    throw 'permission denied.'
  }

  params.permissionList = permissionList
  var operation = params.operation

  if(table[operation].testPermission){
    return Promise.resolve(params)
    .then(table[operation].testPermission)
    .catch(err=>{
      throw 'permission test failed'
    })
  }
  return Promise.resolve()
}

function executeOperation(params)
{
  if(!table[params.operation].operation)
  throw 'operation function n/e, contact developer'
  return table[params.operation].operation(params);
}

//requires:
//  req.body
//  req.user
//returns:
//  Promise
function APIroutine(context){
  /*sample input*/
  var samplebody = {
    operation:'removePost',
    pid:'12',
  }
  /*sample input ends*/

  if(!context.body) throw 'submit with body, please'
  var params = context.body; //parameter object
  report(params);
  verifySubmittedParams(params); //check whether required parameters presents

  params.user = context.user

  return Promise.resolve()
  .then(()=>{
    return testPermission(params)
  })
  .then(()=>{
    //passed all test
    return executeOperation(params)
  })
  .then((result)=>{
    report('operation '+params.operation+' successfully executed')
    return result
  })
}

module.exports = APIroutine;
