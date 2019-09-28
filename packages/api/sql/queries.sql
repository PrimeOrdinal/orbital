begin;

-- query for nearby points
select id, category
from forum_example.job
where st_dwithin(
  geom,
  st_geomfromtext('point(0 0)', 26910),
  1000
);
