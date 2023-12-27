import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@radix-ui/react-icons';
import { WidgetDataType, useSearchResults, useSearchResultsSelectedFilters, widget } from '@sitecore-search/react';
import {
  AccordionFacets,
  ArticleCard,
  FacetItem,
  Pagination,
  Presence,
  SearchResultsAccordionFacets,
  Select,
  SortSelect,
} from '@sitecore-search/ui';

const buildRangeLabel = (min, max) => {
  return typeof min === 'undefined' ? `< $${max}` : typeof max === 'undefined' ? ` > $${min}` : `$${min} - $${max}`;
};
const buildFacetLabel = (selectedFacet) => {
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return `${selectedFacet.facetLabel}: ${buildRangeLabel(selectedFacet.min, selectedFacet.max)}`;
  }
  return `${selectedFacet.facetLabel}: ${selectedFacet.valueLabel}`;
};
export const SearchResultsComponent = ({
  defaultSortType = 'featured_desc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 24,
}) => {
  const {
    widgetRef,
    actions: {
      onResultsPerPageChange,
      onPageNumberChange,
      onItemClick,
      onRemoveFilter,
      onSortChange,
      onFacetClick,
      onClearFilters,
    },
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults({
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
    },
  });
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const selectedSortIndex = sortChoices.findIndex((s) => s.name === sortType);
  const selectedFacetsFromApi = useSearchResultsSelectedFilters();
  if (isLoading) {
    return (
      <div>
        <Presence present={true}>
          <svg aria-busy={true} aria-hidden={false} focusable="false" role="progressbar" viewBox="0 0 20 20">
            <path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" />
          </svg>
        </Presence>
      </div>
    );
  }
  return (
    <div ref={widgetRef}>
      <div>
        {isFetching && (
          <div>
            <Presence present={true}>
              <svg aria-busy={true} aria-hidden={false} focusable="false" role="progressbar" viewBox="0 0 20 20">
                <path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" />
              </svg>
            </Presence>
          </div>
        )}
        {totalItems > 0 && (
          <>
            <section>
              {selectedFacetsFromApi.length > 0 && <button onClick={onClearFilters}>Clear Filters</button>}
              <ul>
                {selectedFacetsFromApi.map((selectedFacet) => (
                  <li key={`${selectedFacet.facetId}${selectedFacet.facetLabel}${selectedFacet.valueLabel}`}>
                    <span>{buildFacetLabel(selectedFacet)}</span>
                    <button onClick={() => onRemoveFilter(selectedFacet)}>X</button>
                  </li>
                ))}
              </ul>
              <SearchResultsAccordionFacets
                defaultFacetTypesExpandedList={[]}
                onFacetTypesExpandedListChange={() => {}}
                onFacetValueClick={onFacetClick}
              >
                {facets.map((f) => (
                  <AccordionFacets.Facet facetId={f.name} key={f.name}>
                    <AccordionFacets.Header>
                      <AccordionFacets.Trigger>{f.label}</AccordionFacets.Trigger>
                    </AccordionFacets.Header>
                    <AccordionFacets.Content>
                      <AccordionFacets.ValueList>
                        {f.value.map((v, index) => (
                          <FacetItem
                            {...{
                              index,
                              facetValueId: v.id,
                            }}
                            key={v.id}
                          >
                            <AccordionFacets.ItemCheckbox>
                              <AccordionFacets.ItemCheckboxIndicator>
                                <CheckIcon />
                              </AccordionFacets.ItemCheckboxIndicator>
                            </AccordionFacets.ItemCheckbox>
                            <AccordionFacets.ItemLabel>
                              {v.text} {v.count && `(${v.count})`}
                            </AccordionFacets.ItemLabel>
                          </FacetItem>
                        ))}
                      </AccordionFacets.ValueList>
                    </AccordionFacets.Content>
                  </AccordionFacets.Facet>
                ))}
              </SearchResultsAccordionFacets>
            </section>
            <section>
              {/* Sort Select */}
              <section>
                {totalItems > 0 && (
                  <div>
                    Showing {itemsPerPage * (page - 1) + 1} - {itemsPerPage * (page - 1) + articles.length} of{' '}
                    {totalItems} results
                  </div>
                )}
                <SortSelect.Root defaultValue={sortChoices[selectedSortIndex]?.name} onValueChange={onSortChange}>
                  <SortSelect.Trigger>
                    <SortSelect.SelectValue>
                      {selectedSortIndex > -1 ? sortChoices[selectedSortIndex].label : ''}
                    </SortSelect.SelectValue>
                    <SortSelect.Icon />
                  </SortSelect.Trigger>
                  <SortSelect.Content>
                    <SortSelect.Viewport>
                      {sortChoices.map((option) => (
                        <SortSelect.Option value={option} key={option.name}>
                          <SortSelect.OptionText>{option.label}</SortSelect.OptionText>
                        </SortSelect.Option>
                      ))}
                    </SortSelect.Viewport>
                  </SortSelect.Content>
                </SortSelect.Root>
              </section>

              {/* Results */}
              <div>
                {articles.map((a, index) => (
                  <ArticleCard.Root key={a.id} article={a}>
                    <ArticleCard.Title>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onItemClick({
                            id: a.id,
                            index,
                            sourceId: a.source_id,
                          });
                        }}
                      >
                        {a.title || a.name}
                      </a>
                    </ArticleCard.Title>
                    <ArticleCard.Content>
                      <ArticleCard.Image />
                      {a.content_text}
                    </ArticleCard.Content>
                  </ArticleCard.Root>
                ))}
              </div>
              <div>
                <div>
                  <label>Results Per Page</label>
                  <Select.Root
                    defaultValue={String(defaultItemsPerPage)}
                    onValueChange={(v) =>
                      onResultsPerPageChange({
                        numItems: Number(v),
                      })
                    }
                  >
                    <Select.Trigger>
                      <Select.SelectValue />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.SelectContent>
                      <Select.Viewport>
                        <Select.SelectItem value="24">
                          <SortSelect.OptionText>24</SortSelect.OptionText>
                        </Select.SelectItem>

                        <Select.SelectItem value="48">
                          <SortSelect.OptionText>48</SortSelect.OptionText>
                        </Select.SelectItem>

                        <Select.SelectItem value="64">
                          <SortSelect.OptionText>64</SortSelect.OptionText>
                        </Select.SelectItem>
                      </Select.Viewport>
                    </Select.SelectContent>
                  </Select.Root>
                </div>
                <div>
                  <Pagination.Root
                    currentPage={page}
                    defaultCurrentPage={1}
                    totalPages={totalPages}
                    onPageChange={(v) =>
                      onPageNumberChange({
                        page: v,
                      })
                    }
                  >
                    <Pagination.PrevPage onClick={(e) => e.preventDefault()}>
                      <ArrowLeftIcon />
                    </Pagination.PrevPage>
                    <Pagination.Pages>
                      {(pagination) =>
                        Pagination.paginationLayout(pagination, {
                          boundaryCount: 1,
                          siblingCount: 1,
                        }).map(({ page, type }) =>
                          type === 'page' ? (
                            <Pagination.Page
                              key={page}
                              aria-label={`Page ${page}`}
                              page={page}
                              onClick={(e) => e.preventDefault()}
                            >
                              {page}
                            </Pagination.Page>
                          ) : (
                            <span key={type}>...</span>
                          ),
                        )
                      }
                    </Pagination.Pages>
                    <Pagination.NextPage onClick={(e) => e.preventDefault()}>
                      <ArrowRightIcon />
                    </Pagination.NextPage>
                  </Pagination.Root>
                </div>
              </div>
            </section>
          </>
        )}
        {totalItems <= 0 && !isFetching && (
          <div>
            <h3>0 Results</h3>
          </div>
        )}
      </div>
    </div>
  );
};
const SearchResultsWidget = widget(SearchResultsComponent, WidgetDataType.SEARCH_RESULTS, 'content');
export default SearchResultsWidget;