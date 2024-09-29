export default function AuditView() {
  return (
    <div>
      this is audit page where admin can see all the games that are played so
      far initially the admin will be presented with the days games. and only
      games that are completed and winning number selected are presented for an
      audit
      <br />
      the intention of this tab is to assess every result that have been
      recoreded by our game administeres
      <br />
      by the end of each day we will assess every game here assuring that that
      the winning numbers inserted by the admin matched the winning number that
      is selected by the achawach
      <br />
      this page will have a strong filtering by date since auditors need to see
      games on a specific date it will be paginated for each date
      <br />
      for example up on entering the page you will see a list games that are
      comleted for the day. if you want to see games of previous day you could
      use the filter to select that date
      <br />
      if you wanted to look at a specific game you could filter by its category
      , by its duration ( hourly , daily weekly) or you could search for it by
      its id , name , title and so on. the search and fitler will work in
      combination. for example if you want to see a game with the title x on a
      date y you could apply date fitler for y and the search will apply this
      filter when searching.
    </div>
  );
}
