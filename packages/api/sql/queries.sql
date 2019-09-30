begin;

-- query for nearby points
select id, category
from forum_example.job
where st_dwithin(
  geom,
  st_geomfromtext('point(0 0)', 26910),
  1000
);

SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As jobs
 FROM (SELECT 'Feature' As type
    , ST_AsGeoJSON(lg.geom)::json As geometry
    , row_to_json(lp) As properties
   FROM forum_example.job As lg
         INNER JOIN (SELECT id, category FROM forum_example.job) As lp
       ON lg.id = lp.id  ) As f )  As fc;
or avoiding a self-join by doing this

SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As jobs
 FROM (SELECT 'Feature' As type
    , ST_AsGeoJSON(lg.geom)::json As geometry
    , row_to_json((SELECT l FROM (SELECT id, category) As l
      )) As properties
   FROM forum_example.job As lg   ) As f )  As fc;
