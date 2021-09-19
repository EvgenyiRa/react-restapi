/*01*/const query = require('../db_apis/query.js'),
            configs=require('../config/configs.js'),
            jwt = configs.jwt;

/*02*/
/*03*/async function post(req, res, next) {
        //console.log('req.body',req.body);
        if (!!req.body.authorization) {
          //const authorization=req.body.authorization.toString();
          jwt.verify(req,jwt,async function(resAuath,tokenOne,user) {
            if (resAuath) {
              try {
                const context = {};
                if (!!req.body.params) {
                    context.params=req.body.params;
                }
                else {
                    context.params=[];
                }
                if (!!req.body.sql) {
                  context.sql=req.body.sql;
                  const rows = await query.find(context);
                  let resObj={tokenOne:tokenOne};
                  if (Array.isArray(rows)) {
                    if (!!rows[0]) {
                        resObj.rows=rows[0];
                    }
                    if (!!rows[1]) {
                        resObj.data=rows[1];
                    }
                  }
                  res.status(200).json(resObj);
                }
                else {
                    res.status(404).end();
                }
              } catch (err) {
                next(err);
              }
            }
            else {
              res.status(200).json({ message: 'Token false' })
            }
          });
        }
        else {
          res.status(200).json({ message: 'User not authorized' })
        }

}

module.exports.post = post;