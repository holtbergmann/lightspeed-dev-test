First of all, I would like to thank you for giving me this opportunity to go through the interview process.  The quick answer to the 3 SQL questions are:

Answer1:
select groups.name as group_name from groups inner join 
(select memberships.user_id, memberships.group_id from memberships where memberships.user_id=(select users.id from users where users.fName='thu' and users.lName='doan')) as temp 

where temp.group_id=groups.id;


Answer 2:
select distinct temp2.fName, temp2.lName from 
(select temp.fName, temp.lName, groups.name as group_name from (select users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp inner join groups where groups.id=temp.group_id) as temp2  

where temp2.group_name='humans' or temp2.group_name='family' order by temp2.fName;


Answer 3:
select g1.fName, g1.lName from

(select temp2.user_id, temp2.fName, temp2.lName, temp2.group_name from 

(select temp.user_id, temp.fName, temp.lName, groups.name as group_name from (select users.id as user_id, users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id) as temp2  where temp2.group_name='humans') as g1

inner join 

(select temp2.user_id, temp2.fName, temp2.lName, temp2.group_name from 

(select temp.user_id, temp.fName, temp.lName, groups.name as group_name from (select users.id as user_id, users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id) as temp2  where temp2.group_name='family') as g2


where g1.user_id=g2.user_id order by g1.fName;


Now for the full explanation:

To answer the SQL questions, I am going to use these table values to explain my thought process:

Table users:
+----+-----------+-------+
| id | fName     | lName |

+----+-----------+-------+

|  1 | thu       | doan  |

|  2 | natalie   | kane  |

|  3 | noah      | doan  |

|  4 | manchitas | dog   |

+----+-----------+-------+

Where id is the primary key column that is auto-incremented

Table groups:
+----+--------+

| id | name   |

+----+--------+

|  1 | humans |

|  2 | pets   |

|  3 | family |

+----+--------+

Where id is the primary key column that is auto-incremented


Table memberships:
+----+---------+----------+

| id | user_id | group_id |

+----+---------+----------+

|  1 |       1 |        1 |

|  6 |       1 |        3 |

|  2 |       2 |        1 |

|  7 |       2 |        3 |

|  3 |       3 |        1 |

|  8 |       3 |        3 |

|  4 |       4 |        2 |

|  9 |       4 |        3 |

+----+---------+----------+

Where id is the primary key column that is auto-incremented

user_id is a foreign_key to users.id, and group_id is a foreign key to groups.id



The first question asks: 

List of groups ‘User A’ has a member in


I'll substitute 'User A' for my user 'thu doan':

+----+-----------+-------+
| id | fName     | lName |

+----+-----------+-------+

|  1 | thu       | doan  |



Basically, I need use the users.id of user: 'thu doan' and see which records in the memberships table have matching memberships.user_id.  This first query will get me the user.id of user: 'thu doan':



select users.id from users where users.fName='thu' and users.lName='doan';



This gives me:

+----+

| id |

+----+

|  1 |

+----+

Now from the memberships table, I need to retrieve all records that have memberships.user_id=1. This query should do the trick:

select memberships.user_id, memberships.group_id from memberships where memberships.user_id=1;

However, since I didn't know the users.id value for the users record, I only knew the fName and lName ('thu doan') I just substitute 1 with my first select statement which gives me:



select memberships.user_id, memberships.group_id from memberships where memberships.user_id=

(select users.id from users where users.fName='thu' and users.lName='doan');



This gives me:

+---------+----------+

| user_id | group_id |

+---------+----------+

|       1 |        1 |

|       1 |        3 |

+---------+----------+



All I now need is the group name for each the respective group_id's in my above result table.  That's just the intersection of the result table of the previous query and the groups table. Which can be accomplished via:

select groups.name as group_name from groups inner join 

(select memberships.user_id, memberships.group_id from memberships where memberships.user_id=(select users.id from users where users.fName='thu' and users.lName='doan')) as temp 

where temp.group_id=groups.id;

This gives me:

+------------+

| group_name |

+------------+

| humans     |

| family     |

+------------+

The query in bolded blue above is the final query to SQL question 1.



The second question asks:

Users with memberships in either GroupA or GroupB


To better illustrate my answer, I will substitute GroupA for humans and GroupB for family



First I get a list of all the groups each user is a member of, this is the intersection of the users table and the memberships table keyed by users.id:



select users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id order by users.fName;

which gives the answer:

+-----------+-------+----------+

| fName     | lName | group_id |

+-----------+-------+----------+

| manchitas | dog   |        2 |

| manchitas | dog   |        3 |

| natalie   | kane  |        1 |

| natalie   | kane  |        3 |

| noah      | doan  |        1 |

| noah      | doan  |        3 |

| thu       | doan  |        1 |

| thu       | doan  |        3 |

+-----------+-------+----------+



However, since I start with the groups.name value and not the groups.id, I need to replace the groups.id values with the groups.name value. That is just the intersection of the above result with the groups table:



select temp.fName, temp.lName, groups.name as group_name from 

(select users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id order by temp.fName;

This gives the result:

+-----------+-------+------------+

| fName     | lName | group_name |

+-----------+-------+------------+

| manchitas | dog   | family     |

| manchitas | dog   | pets       |

| natalie   | kane  | family     |

| natalie   | kane  | humans     |

| noah      | doan  | family     |

| noah      | doan  | humans     |

| thu       | doan  | family     |

| thu       | doan  | humans     |

+-----------+-------+------------+

Notice the above result includes the group pets but we only want groups: humans or family. So we just need to add that constraint and we get the query:

select temp2.fName, temp2.lName, temp2.group_name from 

(select temp.fName, temp.lName, groups.name as group_name from (select users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp inner join groups where groups.id=temp.group_id) as temp2  

where temp2.group_name='humans' or temp2.group_name='family' order by temp2.fName;



Which gives us:

+-----------+-------+------------+

| fName     | lName | group_name |

+-----------+-------+------------+

| manchitas | dog   | family     |

| natalie   | kane  | family     |

| natalie   | kane  | humans     |

| noah      | doan  | humans     |

| noah      | doan  | family     |

| thu       | doan  | humans     |

| thu       | doan  | family     |

+-----------+-------+------------+



However, we only want a list of users, so we write the final query:

select distinct temp2.fName, temp2.lName from 

(select temp.fName, temp.lName, groups.name as group_name from (select users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp inner join groups where groups.id=temp.group_id) as temp2  

where temp2.group_name='humans' or temp2.group_name='family' order by temp2.fName;

Which gives us:

| fName     | lName |

+-----------+-------+

| manchitas | dog   |

| natalie   | kane  |

| noah      | doan  |

| thu       | doan  |

+-----------+-------+



Once again, the answer in bold blue above is the final query.



The last SQL question asks:

Users with memberships in both GroupA and GroupB
As a short cut, since I already retrieved memberships of users in GroupA or GroupB, which is the union of each individual constraint. However in this instance I would like the intersection.  So I can start by separating the answer in the last question into two queries, and as a convenience, this time, I'll include the users.id via:



select temp2.user_id, temp2.fName, temp2.lName, temp2.group_name from 

(select temp.user_id, temp.fName, temp.lName, groups.name as group_name from (select users.id as user_id, users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id) as temp2  where temp2.group_name='humans'  order by temp2.user_id;



Which gives us:

+---------+---------+-------+------------+

| user_id | fName   | lName | group_name |

+---------+---------+-------+------------+

|       1 | thu     | doan  | humans     |

|       2 | natalie | kane  | humans     |

|       3 | noah    | doan  | humans     |

+---------+---------+-------+------------+



The other separated query is:

select temp2.user_id, temp2.fName, temp2.lName, temp2.group_name from 

(select temp.user_id, temp.fName, temp.lName, groups.name as group_name from (select users.id as user_id, users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id) as temp2  where temp2.group_name='family'  order by temp2.user_id;



Which gives us:

+---------+-----------+-------+------------+

| user_id | fName     | lName | group_name |

+---------+-----------+-------+------------+

|       1 | thu       | doan  | family     |

|       2 | natalie   | kane  | family     |

|       3 | noah      | doan  | family     |

|       4 | manchitas | dog   | family     |


+---------+-----------+-------+------------+



Now what we want is the intersection of the records that are in both tables. This can be achieved via:



select g1.fName, g1.lName from

(select temp2.user_id, temp2.fName, temp2.lName, temp2.group_name from 

(select temp.user_id, temp.fName, temp.lName, groups.name as group_name from (select users.id as user_id, users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id) as temp2  where temp2.group_name='humans') as g1

inner join 

(select temp2.user_id, temp2.fName, temp2.lName, temp2.group_name from 

(select temp.user_id, temp.fName, temp.lName, groups.name as group_name from (select users.id as user_id, users.fName, users.lName, memberships.group_id as group_id from users inner join memberships where memberships.user_id=users.id) as temp 

inner join groups where groups.id=temp.group_id) as temp2  where temp2.group_name='family') as g2


where g1.user_id=g2.user_id order by g1.fName;

Which gives:

+---------+-------+

| fName   | lName |

+---------+-------+

| natalie | kane  |

| noah    | doan  |

| thu     | doan  |

+---------+-------+

And this is exactly what we want. Once again, the answer in bold blue above is the final query.


